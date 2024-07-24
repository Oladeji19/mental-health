import "./App.css";
import Home from "./Home.js";
import Mindfulness from "./Mindfulness.js";
import Activities from "./Activities.js";
import Login from "./Login.js";
import Suggestions from "./Suggestions.js";
import Journal from "./Journal.js";
import { useState } from "react";
import logo from "./assets/mindful-logo.png";

function NavBar() {
  {/* The initial homepage with the welcome and the purpose is displayed. */}
  const [page, setPage] = useState({ data: <Home /> });
  {/* Directed to the mindfulness page */}
  const mindfulnessPage = () => {
    setPage({ ...page, data: <Mindfulness /> });
  };
  {/* Directed to the home page */}
  const homePage = () => {
    setPage({...page, data: <Home />});
  }
  {/* Directed to the activities page */}
  const activitiesPage = () => {
    setPage({ ...page, data: <Activities /> });
  };
  {/* Directed to the login page */}
  const loginPage = () => {
    setPage({...page, data: <Login />});
  }
  {/* Directed to the suggestions page */}
  const suggestionsPage = () => {
    setPage({ ...page, data: <Suggestions /> });
  };
  const journalPage = () => {
    setPage({ ...page, data: <Journal /> });
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
            Mindfulness
          </div>
          {/* Directed to activities page when activities is clicked. */}
          <div className="activities" onClick={activitiesPage}>Activities</div>
          {/* Directed to journal page when journal is clicked. */}
          <div className="journal-button" onClick={journalPage}>Journal</div>
          {/* Directed to suggestions page when suggestions is clicked. */}
          <div className="suggestions" onClick={suggestionsPage}>Suggestions</div>
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
