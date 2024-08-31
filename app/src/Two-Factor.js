import "./App.css";
import { useState } from "react";
import {Link} from "react-router-dom";
import { httpsCallable } from "react";
import logo from "./assets/mindful-logo.png";

function TwoFactor(){
    {/* State variable for the 5-digit code. */}
    const [code, setCode] = useState("");
    {/* State variable for the character check, to ensure it is only numbers. */}
    const [characterMsg, setCharacterMsg] = useState("Code needs to be only numbers.");
    {/* State variable for the length. Ensures that length is 5. */}
    const [lengthMsg, setLengthMsg] = useState("Length needs to be 5.");
    {/* State variable for the button, enabled only when code length is 5 and all the values are numbers. */}
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    {/* Checks that code consists only of numbers. */}
    function allNumbers(code) {
        if(code.length === 0) {
            return false;
        }
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for(let c = 0; c < code.length; c++) {
           if(!numbers.includes(code[c])) {
               return false;
           }
        }
        return true;
    }
    {/* Consistently updates the character message, length message, and code, and enables the button when the 5-digit condition has been met. */}
    const handleCode = (event) => {
        const newCode = event.target.value;
        setCode(newCode);
        setCharacterMsg(!allNumbers(newCode) ? "Code needs to be only numbers." : "");
        setLengthMsg(newCode.length !== 5 ? "Length needs to be 5." : "");
        console.log(newCode.length);
        setIsButtonDisabled(!(allNumbers(newCode) && newCode.length === 5));
        console.log("hrthrthrth");
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
