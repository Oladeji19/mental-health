import "./App.css";
import { useState } from "react";
import TwoFactor from "./Two-Factor.js";
import { Link } from "react-router-dom";

function Registration() {
  // State variables
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [emailMsg, setEmailMsg] = useState(
    "Email needs to have a prefix, @, domain and then .edu."
  );
  const [newPasswordMsg, setNewPasswordMsg] = useState(
    "Length needs to be at least 12 characters."
  );
  const [newPasswordMsgCharacters, setNewPasswordMsgCharacters] = useState(
    "Needs to contain uppercase and lowercase characters, numbers, and symbols."
  );
  const [confirmedPasswordMsg, setConfirmedPasswordMsg] = useState(
    "Password should be the same as the original."
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [registerMessage, setRegisterMessage] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  // Function to check if the password meets the requirements
  const apply = (arr, val) => arr.some(a => val.includes(a));

  // Regex for validating email format
  const rightFormat = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    setEmailMsg(!rightFormat(value) ? "Email needs to have a prefix, @, domain and then .edu." : "");
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    const symbols = ["@", "#", "$", "%", "&", "*", "!", "?", "^", "~", "|", "_", "+", "-", "=", "<", ">", "×", "÷", "√", "∞", "±", "≠", "≈", "∑", "∫", "π", "∆", "∂", "€", "£", "¥", "₹", "₽", "₩", "₫", "₦", ".", ",", ";", ":", "'", '"', "(", ")", "[", "]"];
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const lowercase = "abcdefghijklmnopqrstuvwxyz".split("");
    const numbers = "0123456789".split("");

    const booleans = [
      apply(symbols, value),
      apply(uppercase, value),
      apply(lowercase, value),
      apply(numbers, value),
    ];

    setPassword(value);
    setNewPasswordMsg(value.length < 12 ? "Length needs to be at least 12 characters." : "");
    setNewPasswordMsgCharacters(booleans.includes(false) ? "Needs to contain uppercase and lowercase characters, numbers, and symbols." : "");
  };

  const handleConfPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmedPassword(value);
    setConfirmedPasswordMsg(value !== password ? "Password should be the same as the original." : "All set. Have fun.");
    setIsButtonDisabled(value !== password || emailMsg !== "");
  };

  const handleCheckboxChange = (event) => {
    setShowTwoFactor(event.target.checked);
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5001/register_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User registered successfully:', data.message);
        console.log('User ID:', data.user_id);
        setRegisterMessage("Registration successful! You can now login.");
      } else {
        console.error('Registration failed:', data.error);
        setRegisterMessage(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setRegisterMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="form-input">
      <h1 className="title">Create an Account</h1>
      <h3>Please create a username and password.</h3>
      <label>Email</label>
      <input
        type="text"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter email"
      />
      <label>Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
      />
      <p>{emailMsg}</p>
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter new password"
      />
      <p>{newPasswordMsg}</p>
      <p>{newPasswordMsgCharacters}</p>
      <label>Confirm Password</label>
      <input
        type="password"
        value={confirmedPassword}
        onChange={handleConfPasswordChange}
        placeholder="Re-enter password"
      />
      <div className="remember-me">
        <p>Would you like to enable 2 factor authentication?</p>
        <input
          type="checkbox"
          checked={showTwoFactor}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="remember">Enable 2 factor Authentication</label>
      </div>
      {showTwoFactor && <TwoFactor />}
      <div className="login">
        <span>
          Already have an account?<Link to="/">Login</Link>
        </span>
      </div>
      <div id="buttons">
        <button 
          id="register"
          type="button"
          disabled={isButtonDisabled}
          onClick={handleRegister}
        >
          Register
        </button>
        <button 
          id="refreshButton" 
          type="button"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
      <p>{registerMessage}</p>
    </div>
  );
}

export default Registration;
