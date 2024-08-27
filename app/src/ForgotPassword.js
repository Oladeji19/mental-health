import "./App.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function ForgotPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordMsg, setNewPasswordMsg] = useState("Length needs to be at least 12 characters.");
  const [newPasswordMsgCharacters, setNewPasswordMsgCharacters] = useState("Needs to contains uppercase and lowercase characters, numbers, and symbols.");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [confirmedPasswordMsg, setConfirmedPasswordMsg] = useState("Password should be the same as the original.");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const uppercase = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const lowercase = [  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const symbols = [
    '@', '#', '$', '%', '&', '*', '!', '?', '^', '~', '|', '_', '+', '-', '=', 
    '<', '>', '×', '÷', '√', '∞', '±', '≠', '≈', '∑', '∫', 'π', '∆', '∂',
    '€', '£', '¥', '₹', '₽', '₩', '₫', '₦',
    '.', ',', ';', ':', '\'', '"', '(', ')', '[', ']'
  ];
  function apply(arr, val) {
    for(let a of arr) {
      if(val.includes(a)) {
        return true;
      }
    }
    return false;
  }
  const handlePasswordChange = (event) => {
    const value = event.target.value;
    const booleans = [apply(symbols, value), apply(uppercase, value), apply(lowercase, value), apply(numbers, value)]
    setNewPassword(value);
    setNewPasswordMsg(value.length < 12 ? "Length needs to be at least 12 characters." : "");
    setNewPasswordMsgCharacters(booleans.includes(false) ? "Needs to contains uppercase and lowercase characters, numbers, and symbols." : "");
  }
  const handleConfPasswordChange = (event) => {
    const value = event.target.value;
    const booleans = [apply(symbols, value), apply(uppercase, value), apply(lowercase, value), apply(numbers, value)]
    setConfirmedPassword(value);
    setConfirmedPasswordMsg(value != newPassword ? "Password should be the same as the original." : "All set. Have fun.");
    const passwordBools = [newPasswordMsg == "", confirmedPasswordMsg == "All set. Have fun.", newPasswordMsgCharacters == ""];
    setIsButtonDisabled(passwordBools.includes(false));
  }
  return (
    <div className="form-input">
      {/* Title for forgetting the password. */}
      <h1 className="forget-password">Forgot Password</h1>
      {/* Allows you enter your email as well as a new password. */}
      <p>Please enter your email and new password.</p>
      <label>Email</label>
      <input type="text" id="email" />
      <br></br>
      <label>New Password</label>
      <input type="text" value={newPassword} onChange={handlePasswordChange} placeholder="Enter new password"/>
      <br></br>
      <p>{newPasswordMsg}</p>
      <p>{newPasswordMsgCharacters}</p>
      {/* Confirms the password. */}
      <label>Confirm New Password</label>
      <input type="text" value={confirmedPassword} onChange={handleConfPasswordChange} placeholder="Re-enter password" />
      <br></br>
      <p>{confirmedPasswordMsg}</p>
      {/* ALlows you to navigate to the registration page. */}
      <button disabled={isButtonDisabled}>Register</button>
      <br></br>
      <Link to="/">Click here to go back</Link>
    </div>
  );
}

export default ForgotPassword;
