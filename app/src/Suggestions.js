import { useState, useEffect } from "react";

function Suggestions() {
  {/* State variable for counselor */}
  const [counselors, setCounselors] = useState(null);

  {/* State variable for facilities */}
  const [facilities, setFacilities] = useState(null);

  {/* State variable for error */}
  const [error, setError] = useState(null);

  {/* State variable for loading */}
  const [loading, setLoading] = useState(true);

  {/* Sets the current position and filters the possible locations. */}
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(sendPosition, showError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }

    {/* Connects the backend API. */}
    function sendPosition(position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      fetch("/find_counselors_location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude, longitude }),
      })
        .then((response) => {
          console.log(response);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.counselors);
          setCounselors(data.counselors);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => setLoading(false));
      fetch("/find_mental_health_facilities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude, longitude }),
      })
        .then((response) => {
          console.log(response);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.mentalHealthFacilities);
          setFacilities(data.mentalHealthFacilities);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => setLoading(false));
    }

    {/* In case there is a location issue. */}
    function showError(error) {
      let errorMessage;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "User denied the request for Geolocation.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "The request to get user location timed out.";
          break;
        case error.UNKNOWN_ERROR:
          errorMessage = "An unknown error occurred.";
          break;
      }
      console.log(errorMessage);
    }
  }, []);

  {/* Tries to load the locations and spews error if location isn't found. */}
  if (loading) console.log("Loading...");
  if (error) alert("A network error was encountered");

  return (
    counselors &&
    facilities && (
      <div className="recommendation-page">
        {/*Suggestions content begins */}
        <h1 className="recommendations">Recommendation System</h1>
        {/* Gives a description for the recommendation system. */}
        <p className="recommendation-desc">
          We want to help improve your mental health by finding resources for
          you such as YouTube videos, websites, books, nearby events you may
          enjoy, or a safe space to talk to someone.
        </p>
        <h2>Counselors:</h2>
        {/* Prints out all the possible counselors. */}
        <div className="recommendations-array">
          {counselors.map((counselor, index) => (
            <div className="recommendation">
              <div>{counselor.name}</div>
              <hr></hr>
              <div>Address: {counselor.address}</div>
              <div>Rating: {counselor.rating}</div>
              <div>Distance: {counselor.distance}</div>
            </div>
          ))}
        </div>
        {/* Prints out all the mental health facilities. */}
        <h2>Mental Health Facilities:</h2>
        <div className="recommendations-array">
          {facilities.map((facility, index) => (
            <div className="recommendation">
              <div>{facility.name}</div>
              <hr></hr>
              <div>Address: {facility.address}</div>
              <div>Rating: {facility.rating}</div>
              <div>Distance: {facility.distance}</div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}

export default Suggestions;
