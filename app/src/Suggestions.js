import React, { useState } from "react";
import NavBar from "./NavBar.js";

function Suggestions() {
  const [recommendations, setRecommendations] = useState([]);
  const [externalRecommendations, setExternalRecommendations] = useState({});
  const [error, setError] = useState(null); // State to track errors

  const fetchRecommendations = async () => {
    const userId = 1; // Replace with dynamic user ID
    const itemId = 101; // Replace with dynamic item ID

    try {
      const response = await fetch("/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, item_id: itemId }),
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.hybrid_recommendations);
        setExternalRecommendations(data.external_recommendations);
        setError(null); // Clear any previous errors
      } else {
        const errorText = await response.text();
        setError(`Failed to fetch recommendations: ${errorText}`);
        console.error("Failed to fetch recommendations:", errorText);
      }
    } catch (error) {
      setError("An error occurred while fetching recommendations");
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <h2>Recommendations</h2>
      <button onClick={fetchRecommendations}>Get Recommendations</button>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message */}
      <h3>Hybrid Recommendations:</h3>
      <ul>
        {recommendations.map((item) => (
          <li key={item.item_id}>{item.title}</li>
        ))}
      </ul>
      <h3>Book Recommendation:</h3>
      {externalRecommendations.book && (
        <div>
          <h4>{externalRecommendations.book.title}</h4>
          <p>{externalRecommendations.book.authors}</p>
          <p>{externalRecommendations.book.description}</p>
          <a
            href={externalRecommendations.book.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Book
          </a>
        </div>
      )}
      <h3>Video Recommendation:</h3>
      {externalRecommendations.video && (
        <div>
          <h4>{externalRecommendations.video.title}</h4>
          <a
            href={externalRecommendations.video.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch Video
          </a>
        </div>
      )}
      <h3>Ticketmaster Events:</h3>
      <ul>
        {externalRecommendations.ticketmaster_events &&
          externalRecommendations.ticketmaster_events.map((event, index) => (
            <li key={index}>
              <h4>{event.name}</h4>
              <p>{event.start_time}</p>
              <p>{event.venue}</p>
              <a href={event.url} target="_blank" rel="noopener noreferrer">
                View Event
              </a>
            </li>
          ))}
      </ul>
      <h3>PredictHQ Events:</h3>
      <ul>
        {externalRecommendations.predicthq_events &&
          externalRecommendations.predicthq_events.map((event, index) => (
            <li key={index}>
              <h4>{event.name}</h4>
              <p>{event.start_time}</p>
              <p>{event.location}</p>
              <a href={event.url} target="_blank" rel="noopener noreferrer">
                View Event
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Suggestions;
