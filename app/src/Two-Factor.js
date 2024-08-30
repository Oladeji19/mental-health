import "./App.css";
import { useState } from "react";
import {Link} from "react-router-dom";
import { httpsCallable } from "react";
import logo from "./assets/mindful-logo.png";

function TwoFactor(){
    const [code, setCode] = useState("");
    const [characterMsg, setCharacterMsg] = useState("Code needs to be only numbers.");
    const [lengthMsg, setLengthMsg] = useState("Length needs to be 5.");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    function allNumbers(code) {
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for(let c = 0; c < code.length; c++) {
           if(!numbers.includes(code)) {
               return false;
           }
        }
        return true;
    }
    const handleCode = (event) => {
        setCode(event.target.value);
        setCharacterMsg(!allNumbers(code) ? "Code needs to be only numbers." : "");
        setLengthMsg(code.length != 5 ? "Length needs to be 5." : "");
        setIsButtonDisabled(!(allNumbers(code) && code.length === 5));
    }
    return(
        <div className="container">
            <div className="two-factor">
                    {/* Gives you the instructions for creating an account. */}
                    <h1 className="title">Create an Account</h1>
                    {/* Tells you to enter the 5 digit code that is sent to you via email. */}
                    <h3>Please enter a 5-digit code sent to you.</h3>
                    {/* Creates a CS form group that allows you to input the code that is being created. */}
                    <div className="cs-form-group">
                        <label>Code</label>
                        <input type="text" value={code} onChange={handleCode} placeholder="Enter code" />
                    </div>
                    <br></br>
                    <p>{characterMsg}</p>
                    <p>{lengthMsg}</p>
            </div>
            <div id="buttons">
                {/* Creating account and refresh button as suggested below. */}
                <button disabled={isButtonDisabled}>Submit</button>
                <button id="refreshButton" type="refresh">Refresh</button>
            </div>
        </div>
    );
}

export default TwoFactor;
