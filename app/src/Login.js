import "./App.css";

function Login() {
   return (
     <div className="captchabackground">
         {/* Contains the login and password information. Allows user to type username and password.*/}
         <div className="form-input">
            <h1 className="login-title">Log In</h1>
            <h3>Please enter your username and password.</h3>
            <label>Username</label>
            <input type="text" id="username" />
            <br></br>
            <label>Password</label>
            <input type="text" id="password" />
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
               <a href="#">Forgot password?</a>
            </div>
         </div>
         {/* Allows you to register as a new user. */}
         <div className="register">
         <span>
            Don't have an account?<a href="#">Register</a>
         </span>
         </div>
         {/* I'm not a robot button. */}
         <canvas id="captcha">captcha text</canvas>
         {/* Button for submitting and refreshing. */}
         <div id="buttons">
            <button id="submitButton" type="submit">Submit</button>
            <button id="refreshButton" type="submit">Refresh</button>
         </div>
         {/* Generated output. */}
         <span id="output"></span>
     </div>
   );
}

export default Login;
