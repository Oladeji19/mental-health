import "./App.css";
import { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import { registeredUsers } from "./RegisteredUsers.js";

function Login() {
  {
    /* Initializing useNavigate object to allow for conditional navigation. */
  }
  const navigate = useNavigate();
  {
    /* Remember me state variable that toggles status of Remember Me. */
  }
  const [rememberMe, setRememberMe] = useState(false);
  let count = 1;
  {
    /* Creates a username and handles the username change. */
  }
  const [username, setUsername] = useState("");
  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
  };

  {
    /* Creates a password and handles the password change. */
  }
  const [password, setPassword] = useState("");
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  {
    /* Functions created for captcha */
  }
  let captchaSet = false;
  const onCaptchaChange = () => {
    captchaSet = true;
  };
  let captcha;
  const setCaptchaRef = (ref) => {
    if (ref) {
      captcha = ref;
    }
    return captcha;
  };

  {
    /* Function to check if an existing user is logging in correctly */
  }
  const containsUserPassword = (username, password) => {
    const userPass = [false, false];
    for (let i = 0; i < registeredUsers.length; i++) {
      for (const [user, pass] of Object.entries(registeredUsers[i])) {
        if (user === username) {
          userPass[0] = true;
        }
        if (pass === password) {
          userPass[1] = true;
        }
      }
    }
    console.log(userPass);
    return userPass;
  };

  {
    /* Makes sure that captcha is being done before the submit button is being clicked. If button isn't clicked, alert forced for logging in. */
  }
  const canSubmit = () => {
    const result = containsUserPassword(username, password);
    if (!captchaSet) {
      console.log("1");
      alert("Complete the reCAPTCHA below before logging in.");
    } else if (result[0] === false && result[1] === false) {
      console.log("2");
      alert("Please register");
    } else if (result[0] === true && result[1] === false) {
      console.log("3");
      alert("Please go to forgot password");
    } else if (result[0] === false && result[1] === true) {
      console.log("4");
      alert("Username isn't registered. Try again, please.");
    } else {
      if (rememberMe) {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        console.log("User is remembered");
      }
      console.log("5");
      setUsername(username);
      setPassword(password);
      console.log("Your details are", username, password);
      navigate("Home");
    }
  };

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
    }
  }, []);

  return (
    <div className="login">
      {/* Contains the login and password information. Allows user to type username and password.*/}
      <h1 className="login-title">Log In</h1>
      <p>Please enter your username and password.</p>
      <div className="form-input">
        <label>Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUserNameChange}
        />
        <br></br>
        <label>Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <br></br>
      <br></br>
      {/* The container for people who've forgotten their password. */}
      <div className="remember-forgot">
        <div className="remember-me">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={handleCheckboxChange}
            id="remember"
          />
          <label htmlFor="remember">Remember me</label>
        </div>
        <div className="forgot">
          <Link to="Forgot Password">Forgot Password?</Link>
        </div>
      </div>
      {/* Allows you to register as a new user. */}
      <div className="register">
        <span>
          Don't have an account? <Link to="Registration">Register?</Link>
        </span>
      </div>
      {/* I'm not a robot button. */}
      <ReCAPTCHA
        sitekey="6Lcr3iMqAAAAAM7Znb8LuOPob6pZoH3RGR6MXePd"
        onChange={onCaptchaChange}
        ref={(r) => setCaptchaRef(r)}
        className="captchabackground"
      />
      {/* Button for submitting and refreshing. */}
      <div id="buttons">
        <button id="submitButton" type="submit" onClick={canSubmit}>
          Submit
        </button>
        <button
          id="refreshButton"
          type="submit"
          onClick={() => captcha.reset()}
        >
          Refresh
        </button>
      </div>
      {/* Generated output. */}
      <span id="output"></span>
    </div>
  );
}

export default Login;
