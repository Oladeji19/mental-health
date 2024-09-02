import os
import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from googleapiclient.discovery import build
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve the API keys from environment variables
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
TICKETMASTER_API_KEY = os.getenv('TICKETMASTER_API_KEY')
PREDICTHQ_API_KEY = os.getenv('PREDICTHQ_API_KEY')

# Collaborative Filtering Setup
interaction_data = {
    'user_id': [1, 2, 3, 1, 2, 3],
    'item_id': [101, 101, 101, 102, 103, 104],
    'rating': [5, 4, 3, 4, 5, 2]
}
interaction_df = pd.DataFrame(interaction_data)

item_data = {
    'item_id': [101, 102, 103, 104],
    'title': ['Event A', 'Event B', 'Book C', 'Video D'],
    'description': ['A fun event', 'An educational event', 'A great book', 'An informative video']
}
item_df = pd.DataFrame(item_data)

reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(interaction_df[['user_id', 'item_id', 'rating']], reader)
trainset, testset = train_test_split(data, test_size=0.25, random_state=42)

algo = SVD()
algo.fit(trainset)
predictions = algo.test(testset)

print("Collaborative Filtering RMSE:", accuracy.rmse(predictions))

# Content-Based Filtering Setup
item_df['content'] = item_df['title'] + ' ' + item_df['description']
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(item_df['content'])
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
item_indices = pd.Series(item_df.index, index=item_df['item_id'])

def hybrid_recommendations(user_id, item_id, num_recommendations=5):
    """
    Generate hybrid recommendations based on collaborative and content-based filtering.

    Parameters:
        user_id (int): The ID of the user.
        item_id (int): The ID of the item the user is interested in.
        num_recommendations (int): Number of recommendations to return.

    Returns:
        pd.DataFrame: DataFrame containing recommended items.
    """
    # Collaborative Filtering Scores
    user_items = interaction_df[interaction_df['user_id'] == user_id]['item_id'].unique()
    cf_scores = []
    for iid in item_df['item_id']:
        pred = algo.predict(user_id, iid)
        cf_scores.append({'item_id': iid, 'cf_score': pred.est})
    cf_scores_df = pd.DataFrame(cf_scores)

    # Content-Based Filtering Scores
    idx = item_indices[item_id]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    cb_scores = [{'item_id': item_df['item_id'][i], 'cb_score': score} for i, score in sim_scores]
    cb_scores_df = pd.DataFrame(cb_scores)

    # Combine Scores
    final_scores = pd.merge(cf_scores_df, cb_scores_df, on='item_id')
    final_scores['hybrid_score'] = final_scores['cf_score'] + final_scores['cb_score']
    final_scores = final_scores.sort_values(by='hybrid_score', ascending=False)

    recommendations = final_scores.head(num_recommendations)['item_id']
    return item_df[item_df['item_id'].isin(recommendations)].reset_index(drop=True)

API_KEY = os.getenv('GOOGLE_API_KEY')

# Function to get top book recommendation from Google Books API
def get_top_book(keyword):
    """
    Fetch the top book related to the keyword using Google Books API.

    Parameters:
        keyword (str): The search keyword.

    Returns:
        dict or None: Dictionary containing book details or None if not found.
    """
    books_service = build('books', 'v1', developerKey=API_KEY)
    
    request = books_service.volumes().list(
        q=keyword,
        maxResults=1,
        orderBy='relevance',
        printType='BOOKS'  # Corrected to uppercase
    )
    response = request.execute()
    
    if 'items' in response:
        book = response['items'][0]['volumeInfo']
        book_title = book.get('title', 'No title available')
        authors = ', '.join(book.get('authors', ['Unknown author']))
        description = book.get('description', 'No description available')
        book_link = book.get('infoLink', '#')
        return {
            'title': book_title,
            'authors': authors,
            'description': description,
            'link': book_link
        }
    else:
        return None

# Function to get top YouTube video recommendation
def get_top_youtube_video(keyword):
    """
    Fetch the top YouTube video related to the keyword.

    Parameters:
        keyword (str): The search keyword.

    Returns:
        dict or None: Dictionary containing video details or None if not found.
    """
    try:
        youtube = build('youtube', 'v3', developerKey=GOOGLE_API_KEY)
        request = youtube.search().list(
            part='snippet',
            q=keyword,
            type='video',
            order='relevance',
            maxResults=1
        )
        response = request.execute()
        if response['items']:
            video = response['items'][0]
            return {
                'title': video['snippet']['title'],
                'url': f"https://www.youtube.com/watch?v={video['id']['videoId']}"
            }
        else:
            return None
    except Exception as e:
        print(f"Error fetching video: {e}")
        return None

# Function to get fun events from Ticketmaster API
def get_fun_events_ticketmaster(location, max_results=5):
    """
    Fetch fun events from Ticketmaster API based on location.

    Parameters:
        location (str): The city or location.
        max_results (int): Number of events to fetch.

    Returns:
        list or None: List of event dictionaries or None if not found.
    """
    try:
        params = {
            'apikey': TICKETMASTER_API_KEY,
            'keyword': 'fun',
            'city': location,
            'size': max_results,
            'sort': 'date,asc'
        }
        response = requests.get('https://app.ticketmaster.com/discovery/v2/events.json', params=params)
        if response.status_code == 200:
            events = response.json().get('_embedded', {}).get('events', [])
            return [{
                'name': event.get('name', 'No name available'),
                'start_time': event.get('dates', {}).get('start', {}).get('localDate', 'No date available'),
                'venue': event.get('_embedded', {}).get('venues', [{}])[0].get('name', 'No venue available'),
                'url': event.get('url', 'No URL available')
            } for event in events]
        else:
            print(f"Ticketmaster API Error: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error fetching events from Ticketmaster: {e}")
        return None

# Function to get events from PredictHQ API
def get_events_predicthq(query, lat, lon, radius_km=10, max_results=5):
    """
    Fetch events from PredictHQ API based on query and location.

    Parameters:
        query (str): The search keyword.
        lat (float): Latitude of the location.
        lon (float): Longitude of the location.
        radius_km (int): Search radius in kilometers.
        max_results (int): Number of events to fetch.

    Returns:
        list or None: List of event dictionaries or None if not found.
    """
    try:
        headers = {
            "Authorization": f"Bearer {PREDICTHQ_API_KEY}",
            "Accept": "application/json"
        }
        params = {
            "q": query,
            "limit": max_results,
            "within": f"{radius_km}km@{lat},{lon}"
        }
        response = requests.get('https://api.predicthq.com/v1/events/', headers=headers, params=params)
        if response.status_code == 200:
            events = response.json().get('results', [])
            return [{
                'name': event.get('title', 'No title available'),
                'start_time': event.get('start', 'No start time available'),
                'location': event.get('location', 'No location available'),
                'url': event.get('url', 'No URL available')
            } for event in events]
        else:
            print(f"PredictHQ API Error: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error fetching events from PredictHQ: {e}")
        return None

# Example usage of hybrid recommendations
user_id = 1
item_id = 101
recommended_items = hybrid_recommendations(user_id, item_id, num_recommendations=4)

# Example usage of external recommendations
# Google Books API
keyword_book = 'smoking addiction'
book = get_top_book(keyword_book)

# YouTube API
keyword_video = 'meditation for anxiety'
video = get_top_youtube_video(keyword_video)

# Ticketmaster API
location = 'San Francisco'
events_ticketmaster = get_fun_events_ticketmaster(location)


# PredictHQ API
query = 'mental health'
lat = 40.4862  # Latitude for New Brunswick, NJ
lon = -74.4518 # Longitude for New Brunswick, NJ
radius_km = 10
events_predicthq = get_events_predicthq(query, lat, lon, radius_km)