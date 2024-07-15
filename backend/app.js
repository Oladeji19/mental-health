const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const app = express();
require('dotenv').config();
const port = 3000;

app.use(bodyParser.json());
const { Client } = require('@googlemaps/google-maps-services-js');

// Serving static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'app', 'public')));

// Route for serving the index.html file
app.get('/mental_health_locations', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'app', 'public', 'mental_health_locations.html'));
});

// Helper function to convert distances from kilometers to miles
function kmToMiles(distances) {
  return distances.map(distance => {
    const [value, unit] = distance.split(' ');
    if (unit.toLowerCase() === 'km') {
      return `${(parseFloat(value) * 0.621371).toFixed(2)} mi`;
    }
    return distance; // If it's already in miles or another unit, return as is
  });
}

// Helper function to parse distance strings
function parseDistance(distance) {
  const [value] = distance.split(' ');
  return parseFloat(value);
}

// Route for finding mental health counselors near a location
app.post('/find_counselors_location', async (req, res) => {
  const { latitude, longitude } = req.body;
  console.log("Latitude: " + latitude + " Longitude: " + longitude);
  try {
    // Initialize Google Maps Places API client
    const client = new Client({});
    // Make a Places API request to find nearby places
    const response = await client.placesNearby({
      params: {
        location: `${latitude},${longitude}`,
        radius: 5000, // 5km radius
        type: 'health',
        keyword: 'mental health counselor',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    
    // Extract destination coordinates for distance calculation
    const destinations = response.data.results.map(place => 
      `${place.geometry.location.lat},${place.geometry.location.lng}`
    );

    // Get distances for all facilities at once
    const distanceResponse = await client.distancematrix({
      params: {
        origins: [`${latitude},${longitude}`],
        destinations: destinations,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    // Extract distances from the response and convert to miles
    let distances = kmToMiles(distanceResponse.data.rows[0].elements.map(element => element.distance.text));

    // Extract relevant data from API response
    let counselors = response.data.results.map((place,index) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 'N/A',
      distance: distances[index]
    }));

    // Sort counselors by distance
    counselors.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));

    console.log('Counselors:', counselors);
    // Return the sorted list of counselors as JSON
    res.json({ counselors });
  } catch (error) {
    console.error('Error finding counselors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for finding mental health facilities near a location
app.post('/find_mental_health_facilities', async (req, res) => {
  const { latitude, longitude } = req.body;
  console.log("Latitude: " + latitude + " Longitude: " + longitude);
  try {

    // Initialize Google Maps Places API client
    const client = new Client({});
    
    // Make a Places API request to find nearby places
    const response = await client.placesNearby({
      params: {
        location: `${latitude},${longitude}`,
        radius: 8000, // 8km radius
        type: 'health',
        keyword: 'mental health facility',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const destinations = response.data.results.map(place => 
      `${place.geometry.location.lat},${place.geometry.location.lng}`
    );

    // Get distances for all facilities at once
    const distanceResponse = await client.distancematrix({
      params: {
        origins: [`${latitude},${longitude}`],
        destinations: destinations,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    // Extract distances from the response and convert to miles
    let distances = kmToMiles(distanceResponse.data.rows[0].elements.map(element => element.distance.text));
    
    // Extract relevant data from API response
    let mentalHealthFacilities = response.data.results.map((place,index) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 'N/A',
      distance: distances[index]
    }));

    // Sort facilities by distance
    mentalHealthFacilities.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));

    console.log('Mental Health Facilities:', mentalHealthFacilities);
    // Return the sorted list of mental health facilities as JSON
    res.json({ mentalHealthFacilities });
  } catch (error) {
    console.error('Error finding mental health facilities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for finding mental health events near a location
app.post('/find_mental_health_events', async (req, res) => {
  const { latitude, longitude } = req.body;
  console.log(`Latitude: ${latitude} Longitude: ${longitude}`);

  const currentDate = new Date().toISOString().split('T')[0];

  try {
    const response = await axios.get('https://api.predicthq.com/v1/events', {
      headers: {
        'Authorization': `Bearer ${process.env.PREDICTHQ_API_KEY}`,
        'Accept': 'application/json'
      },
      params: {
        'category': 'community,performing-arts,sports, expos, festivals, concerts,conferences',
        'location_around.origin': `${latitude},${longitude}`,
        'location_around.scale': '30km',
        'start.gte': currentDate,
        'limit': 20
      }
    });

    // Initialize Google Maps client
    const client = new Client({});

    // Use Promise.all to perform reverse geocoding and distance calculation for all events in parallel
    let events = await Promise.all(response.data.results.map(async event => {
      const [lng, lat] = event.location;
      
      // Perform reverse geocoding
      const geocodeResponse = await client.reverseGeocode({
        params: {
          latlng: `${lat},${lng}`,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      // Get the formatted address from the geocoding result
      const address = geocodeResponse.data.results[0]?.formatted_address || 'Address not found';

      // Calculate distance
      const distanceResponse = await client.distancematrix({
        params: {
          origins: [`${latitude},${longitude}`],
          destinations: [`${lat},${lng}`],
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      // Extract distance and convert to miles
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

    // Sort events by distance
    events.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));

    console.log('Mental Health Events:', JSON.stringify(events, null, 2));

    res.json({ events });

  } catch (error) {
    console.error('Error finding mental health events:', error.response ? error.response.data : error.message);
    res.status(500).json({
      error: 'Internal server error',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/mental_health_locations`);
});