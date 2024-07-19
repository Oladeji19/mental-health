import "./App.css";
import Home from "./Home.js";
import Mindfulness from "./Mindfulness.js";
import { useState } from "react";
import logo from "./assets/mindful-logo.png";

function NavBar() {
  const [page, setPage] = useState({ data: <Home /> });
  const mindfulnessPage = () => {
    setPage({ ...page, data: <Mindfulness /> });
  };
  return (
    <>
      <div className="nav-bar">
        <img className="logo" src={logo} />
        <div className="options">
          <div className="mindfulness" onClick={mindfulnessPage}>
            Mindfulness
          </div>
          <div className="activities">Activities</div>
          <div className="suggestions">Suggestions</div>
          <div className="login-button">Log In</div>
        </div>
      </div>
      <div className="current-page">{page.data}</div>
    </>
  );
}

export default NavBar;
