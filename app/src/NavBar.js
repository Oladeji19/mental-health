import "./App.css";
import logo from "./assets/mindful-logo.png";

function NavBar() {
  return (
    <div className="nav-bar">
      <img className="logo" src={logo} />
      <div className="options">
        <div className="activities">Activities</div>
        <div className="suggestions">Suggestions</div>
        <div className="login-button">Log In</div>
      </div>
    </div>
  );
}

export default NavBar;