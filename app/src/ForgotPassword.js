import "./App.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function ForgotPassword() {
  {/* State variable for the new password created. */}
  const [newPassword, setNewPassword] = useState("");

  {/* State variable for the new password message. Length needs to be at least 12 characters.  */}
  const [newPasswordMsg, setNewPasswordMsg] = useState("Length needs to be at least 12 characters.");

  {/* State variable for the new password message to make sure that it consists of uppercase, lowercase, numbers, and symbols.  */}
  const [newPasswordMsgCharacters, setNewPasswordMsgCharacters] = useState("Needs to contains uppercase and lowercase characters, numbers, and symbols.");

  {/* State variable for the confirmed password.  */}
  const [confirmedPassword, setConfirmedPassword] = useState("");

  {/* State variable to ensure that the confirmed password is the same as the new password.  */}
  const [confirmedPasswordMsg, setConfirmedPasswordMsg] = useState("Password should be the same as the original.");

  {/* State variable for enabling and disabling the button to create the new account assuming that the new password as well as the confirmed password are both the same. */}
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  {/* Uppercase letters */}
  const uppercase = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  {/* Lowercase letters */}
  const lowercase = [  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  {/* Numbers */}
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  {/* Symbols */}
  const symbols = [
    '@', '#', '$', '%', '&', '*', '!', '?', '^', '~', '|', '_', '+', '-', '=', 
    '<', '>', '×', '÷', '√', '∞', '±', '≠', '≈', '∑', '∫', 'π', '∆', '∂',
    '€', '£', '¥', '₹', '₽', '₩', '₫', '₦',
    '.', ',', ';', ':', '\'', '"', '(', ')', '[', ']'
  ];

  {/* Checks to make sure that the password contains an element from an array. */}
  function apply(arr, val) {
    for(let a of arr) {
      if(val.includes(a)) {
        return true;
      }
    }
    return false;
  }
  {/* Updates the new password message for character check and length check as and when the user is adding a new password. */}
  const handlePasswordChange = (event) => {
    {/* Takes in the value. */}
    const value = event.target.value;
    {/* Apply function is created for symbols, uppercase, lowercase and numbers. For each apply function, a check happens to make sure that at least one of each: uppercase, lowercase, symbol, and numbers are present. */}
    const booleans = [apply(symbols, value), apply(uppercase, value), apply(lowercase, value), apply(numbers, value)]
    {/* Setting the new password, the new password length check message, as well as the new password character check message. */}
    setNewPassword(value);
    setNewPasswordMsg(value.length < 12 ? "Length needs to be at least 12 characters." : "");
    setNewPasswordMsgCharacters(booleans.includes(false) ? "Needs to contains uppercase and lowercase characters, numbers, and symbols." : "");
  }
  const handleConfPasswordChange = (event) => {
    {/* Takes in the value. */}
    const value = event.target.value;
    {/* Sets the confirmed password and message depending on whether the confirm password is the same as the new password. */}
    setConfirmedPassword(value);
    setConfirmedPasswordMsg(value !== newPassword ? "Password should be the same as the original." : "All set. Have fun.");
    console.log(confirmedPasswordMsg !== "All set. Have fun.");
    {/* Enables button if message says "All set. Have fun.". Else, keep the button disabled. */}
    setIsButtonDisabled(value != newPassword);
  }

  {/* Creates the state variable to show password. */}
  const [showPassword, setShowPassword] = useState(false);

  {/* Toggling the show password. */}
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div className="form-input">
      {/* Title for forgetting the password. */}
      <h1 className="forget-password">Forgot Password</h1>
      {/* Allows you enter your email as well as a new password. */}
      <p>Please enter new password.</p>
      <br></br>
      <label>New Password</label>
      <input type="password" value={newPassword} onChange={handlePasswordChange} placeholder="Enter new password"/>
      <br></br>
      <p>{newPasswordMsg}</p>
      <p>{newPasswordMsgCharacters}</p>
      {/* Confirms the password. */}
      <label>Confirm New Password</label>
      <input type="password" value={confirmedPassword} onChange={handleConfPasswordChange} placeholder="Re-enter password" />
      <br></br>
      <p>{confirmedPasswordMsg}</p>
      {/* ALlows you to navigate to the registration page. */}
      <button disabled={isButtonDisabled}>Register</button>
      <br></br>
      {/* Allows you to navigate back to the login page. */}
      <Link to="/">Click here to go back</Link>
    </div>
  );
}

export default ForgotPassword;
