from flask import Flask, request, jsonify
from flask_cors import CORS
from recommendation_system import hybrid_recommendations, get_top_book, get_top_youtube_video, get_fun_events_ticketmaster, get_events_predicthq

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    print(f"Received data: {data}")
    user_id = data.get('user_id')
    item_id = data.get('item_id')
    
    # Hybrid Recommendations
    recommendations = hybrid_recommendations(user_id, item_id, num_recommendations=3)
    recommendations_list = recommendations.to_dict(orient='records')
    
    # External Recommendations
    keyword_book = 'smoking addiction'  # You might want to make this dynamic
    book = get_top_book(keyword_book)

    keyword_video = 'meditation for anxiety'  # You might want to make this dynamic
    video = get_top_youtube_video(keyword_video)

    location = 'San Francisco'  # You might want to make this dynamic
    events_ticketmaster = get_fun_events_ticketmaster(location)

    query = 'mental health'  # You might want to make this dynamic
    lat = 40.4862  # Latitude for New Brunswick, NJ
    lon = -74.4518  # Longitude for New Brunswick, NJ
    radius_km = 10
    events_predicthq = get_events_predicthq(query, lat, lon, radius_km)

    # Combine all recommendations
    external_recommendations = {
        'book': book,
        'video': video,
        'ticketmaster_events': events_ticketmaster,
        'predicthq_events': events_predicthq,
    }
    
    response = {
        'hybrid_recommendations': recommendations_list,
        'external_recommendations': external_recommendations
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=4000)