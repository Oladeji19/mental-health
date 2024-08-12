const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const { Client } = require('@googlemaps/google-maps-services-js');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'app', 'public')));

// Initialize cache for quotes
const cache = new Map();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Helper function to get or set cache
const getOrSetCache = async (key, fetchFunction) => {
  if (cache.has(key)) {
    const { value, timestamp } = cache.get(key);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return value;
    }
  }
  const freshData = await fetchFunction();
  cache.set(key, { value: freshData, timestamp: Date.now() });
  return freshData;
};

// Function to fetch a quote from the external API
const fetchQuoteFromAPI = async () => {
  const response = await axios.get('https://zenquotes.io/api/random');
  return response.data[0];
};


// Helper function to convert distances from kilometers to miles
function kmToMiles(distances) {
  return distances.map(distance => {
    const [value, unit] = distance.split(' ');
    if (unit.toLowerCase() === 'km') {
      return `${(parseFloat(value) * 0.621371).toFixed(2)} mi`;
    }
    return distance;
  });
}

// Helper function to parse distance strings
function parseDistance(distance) {
  const [value] = distance.split(' ');
  return parseFloat(value);
}


// Serve the mental health locations page
app.get('/mental_health_locations', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'app', 'public', 'mental_health_locations.html'));
});

// Get a random motivational quote
app.get('/api/quotes/random', async (req, res) => {
  try {
    const quote = await getOrSetCache('randomQuote', fetchQuoteFromAPI);
    res.json({ text: quote.q, author: quote.a });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Get all motivational quotes (cached)
app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await getOrSetCache('allQuotes', async () => {
      const fetchedQuotes = [];
      for (let i = 0; i < 10; i++) {
        const quote = await fetchQuoteFromAPI();
        fetchedQuotes.push({ text: quote.q, author: quote.a });
      }
      return fetchedQuotes;
    });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Find mental health counselors near a location
app.post('/find_counselors_location', async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    const client = new Client({});
    const response = await client.placesNearby({
      params: {
        location: `${latitude},${longitude}`,
        radius: 5000,
        type: 'health',
        keyword: 'mental health counselor',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    
    const destinations = response.data.results.map(place => 
      `${place.geometry.location.lat},${place.geometry.location.lng}`
    );

    const distanceResponse = await client.distancematrix({
      params: {
        origins: [`${latitude},${longitude}`],
        destinations: destinations,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    let distances = kmToMiles(distanceResponse.data.rows[0].elements.map(element => element.distance.text));

    let counselors = response.data.results.map((place,index) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 'N/A',
      distance: distances[index]
    }));

    counselors.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));

    res.json({ counselors });
  } catch (error) {
    console.error('Error finding counselors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Find mental health facilities near a location
app.post('/find_mental_health_facilities', async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    const client = new Client({});
    const response = await client.placesNearby({
      params: {
        location: `${latitude},${longitude}`,
        radius: 8000,
        type: 'health',
        keyword: 'mental health facility',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const destinations = response.data.results.map(place => 
      `${place.geometry.location.lat},${place.geometry.location.lng}`
    );

    const distanceResponse = await client.distancematrix({
      params: {
        origins: [`${latitude},${longitude}`],
        destinations: destinations,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    let distances = kmToMiles(distanceResponse.data.rows[0].elements.map(element => element.distance.text));
    
    let mentalHealthFacilities = response.data.results.map((place,index) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 'N/A',
      distance: distances[index]
    }));

    mentalHealthFacilities.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));

    res.json({ mentalHealthFacilities });
  } catch (error) {
    console.error('Error finding mental health facilities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Find mental health events near a location
app.post('/find_mental_health_events', async (req, res) => {
  const { latitude, longitude } = req.body;
  const currentDate = new Date().toISOString().split('T')[0];

  try {
    const response = await axios.get('https://api.predicthq.com/v1/events', {
      headers: {
        'Authorization': `Bearer ${process.env.PREDICTHQ_API_KEY}`,
        'Accept': 'application/json'
      },
      params: {
        'category': 'community,performing-arts,sports,expos,festivals,concerts,conferences',
        'location_around.origin': `${latitude},${longitude}`,
        'location_around.scale': '30km',
        'start.gte': currentDate,
        'limit': 20
      }
    });

    const client = new Client({});

    let events = await Promise.all(response.data.results.map(async event => {
      const [lng, lat] = event.location;
      
      const geocodeResponse = await client.reverseGeocode({
        params: {
          latlng: `${lat},${lng}`,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      const address = geocodeResponse.data.results[0]?.formatted_address || 'Address not found';

      const distanceResponse = await client.distancematrix({
        params: {
          origins: [`${latitude},${longitude}`],
          destinations: [`${lat},${lng}`],
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      const distances = kmToMiles([distanceResponse.data.rows[0].elements[0].distance.text])[0];

      return {
        title: event.title,
        start: event.start,
        end: event.end,
        category: event.category,
        description: event.description,
        address: address,
        location: { lat, lng },
        distance: distances
      };
    }));

    events.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));

    res.json({ events });
  } catch (error) {
    console.error('Error finding mental health events:', error.response ? error.response.data : error.message);
    res.status(500).json({
      error: 'Internal server error',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/fin`);
});