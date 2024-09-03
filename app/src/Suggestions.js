import React, { useState } from "react";
import NavBar from "./NavBar.js";

function Suggestions() {
  // State variables for tracking the user's recommendations, and the error status.
  const [recommendations, setRecommendations] = useState([]);
  const [externalRecommendations, setExternalRecommendations] = useState({});
  const [error, setError] = useState(null); // State to track errors

  const [showRecommendations, setShowRecommendations] = useState(false); // Shows recommendations as the button is clicked.

  // Section that fetches the recommendation system API.
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
    setShowRecommendations(true);
    console.log(showRecommendations);
  };

  return (
    <>
      <NavBar />
      <div className="rec-page-content">
        {/* Title for the recommendation system page. */}
        <h2 className="recs-title">Recommendations</h2>
        <p>
          Click the button below to receive books, videos, and events
          recommendations.
        </p>
        <button onClick={fetchRecommendations}>Get Recommendations</button>
        {/* Displays an error message if the recommendation system API fails to be fetched. */}
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        {/* The list of hybrid recommendations */}
        {showRecommendations && (
          <>
            <h3>Hybrid Recommendations:</h3>
            <ul>
              {recommendations.map((item) => (
                <li key={item.item_id}>{item.title}</li>
              ))}
            </ul>
            {/* The list of book recommendations */}
            <h3>Book Recommendation:</h3>
            {externalRecommendations.book && (
              <div className="book-recs">
                <h4>{externalRecommendations.book.title}</h4>
                <p>
                  <strong>Author: </strong>
                  {externalRecommendations.book.authors}
                </p>
                <p className="book-desc">
                  <strong>Description: </strong>
                  {externalRecommendations.book.description}
                </p>
                <a
                  href={externalRecommendations.book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Book
                </a>
              </div>
            )}
            {/* The list of video recommendations */}
            <h3>Video Recommendation:</h3>
            {externalRecommendations.video && (
              <div className="video-recs">
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
            {/* The list of Ticketmaster event recommendations */}
            <h3>Ticketmaster Events:</h3>
            <ul className="ticketmaster-events">
              {externalRecommendations.ticketmaster_events &&
                externalRecommendations.ticketmaster_events.map(
                  (event, index) => (
                    <li key={index}>
                      <h4>{event.name}</h4>
                      <p>Start Time: {event.start_time}</p>
                      <p>Venue Location: {event.venue}</p>
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Event
                      </a>
                    </li>
                  )
                )}
            </ul>
            {/* The list of PredictHQ event recommendations */}
            <h3>PredictHQ Events:</h3>
            <ul className="predictHQ-events">
              {externalRecommendations.predicthq_events &&
                externalRecommendations.predicthq_events.map((event, index) => (
                  <li key={index}>
                    <h4>{event.name}</h4>
                    <p>Start Time: {event.start_time}</p>
                    <p>Location: {event.location}</p>
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Event
                    </a>
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default Suggestions;
