import "./App.css";
import RegistrationPage from "./Registration.js";

function ForgotPassword(){
    {/* Creates the div for forgetting the password. */}
    <div className="form-input">
            {/* Title for forgetting the password. */}
            <h1 className="forget-password">Forgot Password</h1>
            {/* Allows you enter your email as well as a new password. */}
            <h3>Please enter your Email.</h3>
            <label>Email</label>
            <input type="text" id="email" />
            <label>New Password</label>
            <input type="text" id="new-password" />
            <br></br>
            {/* Confirms the password. */}
            <label>Confirm New Password</label>
            <input type="text" id="confirm-new-password" />
            <br></br>
            {/* ALlows you to navigate to the registration page. */}
            <div className="register" onClick={RegistrationPage} href="#">
                Register
            </div>
    </div>
}

export default ForgotPassword;
