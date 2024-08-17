import "./App.css";
import { useState } from "react";
import {Link} from "react-router-dom";
import { httpsCallable } from "react";
import logo from "./assets/mindful-logo.png";

function Registration(){
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [message, setMessage] = useState('');


   const handleEmailChange = (event) =>{
        setEmail(event.target.value);
   };

    const handlePasswordChange = (event) =>{
            setPassword(event.target.value);
    };
    
    return(
        <div className="container">
            <div className="sign-up">
                    <h1 className="title">Create an Account</h1>
                    <h3>Please create a username and password.</h3>
                    <div class="cs-form-group">
                        <label>Email</label>
                        <input type="text" id="email" />
                    </div>
                    <br></br>
                    <label>Password</label>
                    <input type="text" id="password" />
                    <label>Confirm Password</label>
                    <input type="text" id="confirm-password" />
            </div>

            <br></br>
            <br></br>
            <div className="login">
                <span>
                    Already have an account?<a href="#">Login</a>
                </span>
            </div>
            <div id="buttons">
            <button id="submitButton" type="register">Create Account</button>
            <button id="refreshButton" type="refresh">Refresh</button>
         </div>
        </div>
    );
}

export default Registration;
