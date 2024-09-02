import "./App.css";
import logo from "./assets/mindful-logo.png";
import { useNavigate } from "react-router-dom";

function NavBar() {
  {
    /* Initializing useNavigate object to allow for conditional navigation. */
  }
  const navigate = useNavigate();
  {
    /* Directed to the mindfulness page */
  }
  const mindfulnessPage = () => {
    window.location.href = "http://127.0.0.1:5000/";
  };
  {
    /* Directed to the home page */
  }
  const homePage = () => {
    navigate("/Home");
  };
  {
    /* Directed to the login page */
  }
  const loginPage = () => {
    navigate("/");
  };
  {
    /* Directed to the suggestions page */
  }
  const suggestionsPage = () => {
    navigate("/Suggestions");
  };
  {
    /* Directed to the journal page */
  }
  const journalPage = () => {
    navigate("/Journal");
  };
  const healthCarePage = () => {
    navigate("/Healthcare");
  };
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
          <div className="journal-button" onClick={journalPage}>
            Journal
          </div>
          {/* Directed to suggestions page when suggestions is clicked. */}
          <div className="suggestions" onClick={suggestionsPage}>
            Recommendations
          </div>
          {/* Directed to login page when healthcareAPI is clicked. */}
          <div className="healthcare-API-button" onClick={healthCarePage}>
            Healthcare API
          </div>
          {/* Directed to login page when login is clicked. */}
          <div className="login-button" onClick={loginPage}>
            Log In
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
