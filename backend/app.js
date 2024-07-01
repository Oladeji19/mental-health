const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
require('dotenv').config();
const port = 3000;
app.use(bodyParser.json()); 
const { Client } = require('@googlemaps/google-maps-services-js');

// Serving static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'app', 'public')));

// Route for serving the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'app', 'public', 'index.html'));
});



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
        radius: 5000,  // 5km radius
        type: 'health',
        keyword: 'mental health counselor',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    // Extract relevant data from API response
    const counselors = response.data.results.map(place => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 'N/A',
    }));

    console.log('Counselors:', counselors);
    
    // Return the list of counselors as JSON
    res.json({ counselors });
  } catch (error) {
    console.error('Error finding counselors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
        radius: 8000,  // 5km radius
        type: 'health',
        keyword: 'mental health facility',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    // Extract relevant data from API response
    const mentalHealthFacilities = response.data.results.map(place => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 'N/A',
    }));

    console.log('Mental Health Facilities:', mentalHealthFacilities);
    
    // Return the list of mental health facilities as JSON
    res.json({ mentalHealthFacilities });
  } catch (error) {
    console.error('Error finding mental health facilities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Starting the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
