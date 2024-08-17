import "./App.css";
import { useState } from "react";
import { Link } from "react-router-dom";
// import { httpsCallable } from "react";

function Registration() {
  {
    /* Allows you to set the email, password, and message upon clicking the buttons for emails, passwords, and manages. */
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  {
    /* Sets emails to target values. */
  }
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  {
    /* Sets password to target values. */
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className="form-input">
      {/* Creates an account and gives space for username and password. */}
      <h1 className="title">Create an Account</h1>
      <p>Please create a username and password.</p>
      <label>Email</label>
      <input type="text" id="email" />
      <br></br>
      <label>Password</label>
      <input type="text" id="password" />
      <br></br>
      <label>Confirm Password</label>
      <input type="text" id="confirm-password" />
      <div className="two-factor">
        {/* Basically asks you for two-factor authentication. */}
        <p>Would you like to enable 2 factor authentication?</p>
        <div className="two-factor-box">
          <input type="checkbox" id="remember" />
          {/* If checked, gives you a label to enable two factor authentication. */}
          <label htmlFor="remember">Enable 2 factor Authentication</label>
        </div>
      </div>
      <br></br>
      <div>
        {/* Gives you a chance to login if you already have the given account. */}
        <span>
          Already have an account? <Link to="/">Login</Link>
        </span>
      </div>
      <br></br>
      <div id="buttons">
        {/* Gives you chance to create account. */}
        <button id="submitButton" type="register">
          Create Account
        </button>
        {/* Gives you chance to refresh if login is being done. */}
        <button id="refreshButton" type="refresh">
          Refresh
        </button>
      </div>
    </div>
  );
}

export default Registration;
