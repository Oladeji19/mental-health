import "./App.css";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import ForgotPassword from "./ForgotPassword.js";
import Registration from "./Registration.js";
import { Outlet, Link } from 'react-router-dom';

function Login() {
   {/* Creates a username and handles the username change. */}
   const [username, setUsername] = useState("");
   const handleUserNameChange = (e) => {setUsername(e.target.value)};

   {/* Creates a password and handles the password change. */}
   const [password, setPassword] = useState("");
   const handlePasswordChange = (e) => {setPassword(e.target.value)};
  
   {/* Functions created for captcha */}
   let captchaSet = false;
   const onCaptchaChange = () => {captchaSet = true; };
   let captcha;
   const setCaptchaRef = (ref) => {
      if(ref) { 
         captcha = ref;
      }
      return captcha;
   };

   {/* Makes sure that captcha is being done before the submit button is being clicked. If button isn't clicked, alert forced for logging in. */}
   const canSubmit = () => {
       if(!captchaSet) {
         alert("Complete the reCAPTCHA below before logging in.");
       } else {
         setUsername(username);
         setPassword(password);
         console.log("Your details are", username, password);
         alert("Logged In.");
       }
   };

   
   return (
     <div className="login">
         {/* Contains the login and password information. Allows user to type username and password.*/}
         <h1 className="login-title">Log In</h1>
         <p>Please enter your username and password.</p>
         <div className="form-input">
            <label>Username</label>
            <input type="text" id="username" onChange={handleUserNameChange} />
            <br></br>
            <label>Password</label>
            <input type="password" id="password" onChange={handlePasswordChange} />
         </div>
         <br></br>
         <br></br>
         {/* The container for people who've forgotten their password. */}
         <div className="remember-forgot">
            <div className="remember-me">
               <input type="checkbox" id="remember" />
               <label htmlFor="remember">Remember me</label>
            </div>
            <div className="forgot">
               <Link to="/forgot-password">Forgot Password?</Link>
            </div>
         </div>
         {/* Allows you to register as a new user. */}
         <div className="register">
         <span>
            Don't have an account?<Link to="/registration">Register?</Link>
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
            <button id="submitButton" type="submit" onClick={canSubmit}>Submit</button>
            <button id="refreshButton" type="submit" onClick={() => captcha.reset()}>Refresh</button>
         </div>
         {/* Generated output. */}
         <span id="output"></span>
     </div>
   );
}

export default Login;
