import "./App.css";
import { Link } from "react-router-dom";

function ForgotPassword() {
  {
    /* Creates the div for forgetting the password. */
  }
  return (
    <div className="form-input">
      {/* Title for forgetting the password. */}
      <h1 className="forget-password">Forgot Password</h1>
      {/* Allows you enter your email as well as a new password. */}
      <h3>Please enter your email and new password.</h3>
      <label>Email</label>
      <input type="text" id="email" />
      <br></br>
      <label>New Password</label>
      <input type="text" id="new-password" />
      <br></br>
      {/* Confirms the password. */}
      <label>Confirm New Password</label>
      <input type="text" id="confirm-new-password" />
      <br></br>
      {/* ALlows you to navigate to the registration page. */}
      <button className="register">Register</button>
      <br></br>
      <Link to="/">Click here to go back</Link>
    </div>
  );
}

export default ForgotPassword;