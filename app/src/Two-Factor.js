import "./App.css";
import { useState } from "react";
import {Link} from "react-router-dom";
import { httpsCallable } from "react";
import logo from "./assets/mindful-logo.png";

function TwoFactor(){
    return(
        <div className="container">
            <div className="two-factor">
                    {/* Gives you the instructions for creating an account. */}
                    <h1 className="title">Create an Account</h1>
                    {/* Tells you to enter the 5 digit code that is sent to you via email. */}
                    <h3>Please enter a 5-digit code sent to you.</h3>
                    {/* Creates a CS form group that allows you to input the code that is being created. */}
                    <div class="cs-form-group">
                        <label>Code</label>
                        <input type="text" id="code" />
                    </div>
                    <br></br>
            </div>
            <div id="buttons">
            {/* Creating account and refresh button as suggested below. */}
            <button id="submitButton" type="register">Create Account</button>
            <button id="refreshButton" type="refresh">Refresh</button>
         </div>
        </div>
    );
}

export default TwoFactor;
