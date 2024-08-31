import "./App.css";
import Home from "./Home.js";
import Mindfulness from "./Mindfulness.js";
import Login from "./Login.js";
import Suggestions from "./Suggestions.js";
import Journal from "./Journal.js";
import HealthcareAPI from "./HealthcareAPI.js";
import { useState } from "react";
import logo from "./assets/mindful-logo.png";

function NavBar() {
  {/* The initial homepage with the welcome and the purpose is displayed. */}
  const [page, setPage] = useState({ data: <Login /> });
  {/* Directed to the mindfulness page */}
  const mindfulnessPage = () => {
    window.location.href = "http://127.0.0.1:5000/";
  };
  {/* Directed to the home page */}
  const homePage = () => {
    setPage({...page, data: <Home />});
  }
  {/* Directed to the login page */}
  const loginPage = () => {
    setPage({...page, data: <Login />});
  }
  {/* Directed to the suggestions page */}
  const suggestionsPage = () => {
    setPage({ ...page, data: <Suggestions /> });
  };
  {/* Directed to the journal page */}
  const journalPage = () => {
    setPage({ ...page, data: <Journal /> });
  }
  const healthCarePage = () => {
    setPage({...page, data: <HealthcareAPI />});
  }
  return (
    <>
      <div className="nav-bar">
        {/* Directed to home page when logo is clicked. */}
        <img className="logo" onClick={homePage} src={logo} />
        {/* Accessing the navbar */}
        <div className="options">
          {/* Directed to home page when logo is clicked. */}
          <div className="mindfulness" onClick={mindfulnessPage}>
           Venting Chat Room
          </div>
          {/* Directed to journal page when journal is clicked. */}
          <div className="journal-button" onClick={journalPage}>Journal</div>
          {/* Directed to suggestions page when suggestions is clicked. */}
          <div className="suggestions" onClick={suggestionsPage}>Recommendations</div>
          {/* Directed to login page when healthcareAPI is clicked. */}
          <div className="healthcare-API-button" onClick={healthCarePage}>Healthcare API</div>
          {/* Directed to login page when login is clicked. */}
          <div className="login-button" onClick={loginPage}>Log In</div>
        </div>
      </div>
      {/* The certain page is displayed. */}
      <div className="current-page">{page.data}</div>
    </>
  );
}

export default NavBar;
