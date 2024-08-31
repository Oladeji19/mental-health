import "./App.css";
import { useState } from "react";
import TwoFactor from "./Two-Factor.js";
import { Link } from "react-router-dom";
import { registeredUsers } from "./RegisteredUsers.js";

function Registration() {
  {
    /* State variable for email. */
  }
  const [email, setEmail] = useState("");

  {
    /* State variable for email message. */
  }
  const [emailMsg, setEmailMsg] = useState(
    "Email needs to have a prefix, @, domain and then .edu."
  );

  {
    /* State variable for two factor. */
  }
  const [showTwoFactor, setShowTwoFactor] = useState("");

  {
    /* State variable for the new password created. */
  }
  const [newPassword, setNewPassword] = useState("");

  {
    /* State variable for the new password message. Length needs to be at least 12 characters.  */
  }
  const [newPasswordMsg, setNewPasswordMsg] = useState(
    "Length needs to be at least 12 characters."
  );

  {
    /* State variable for the new password message to make sure that it consists of uppercase, lowercase, numbers, and symbols.  */
  }
  const [newPasswordMsgCharacters, setNewPasswordMsgCharacters] = useState(
    "Needs to contains uppercase and lowercase characters, numbers, and symbols."
  );

  {
    /* State variable for the confirmed password.  */
  }
  const [confirmedPassword, setConfirmedPassword] = useState("");

  {
    /* State variable to ensure that the confirmed password is the same as the new password.  */
  }
  const [confirmedPasswordMsg, setConfirmedPasswordMsg] = useState(
    "Password should be the same as the original."
  );

  {
    /* State variable for enabling and disabling the button to create the new account assuming that the new password as well as the confirmed password are both the same. */
  }
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  {
    /* Register message */
  }
  const [registerMessage, setRegisterMessage] = useState("");

  {
    /* Uppercase letters */
  }
  const uppercase = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  {
    /* Lowercase letters */
  }
  const lowercase = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  {
    /* Numbers */
  }
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  {
    /* Symbols */
  }
  const symbols = [
    "@",
    "#",
    "$",
    "%",
    "&",
    "*",
    "!",
    "?",
    "^",
    "~",
    "|",
    "_",
    "+",
    "-",
    "=",
    "<",
    ">",
    "×",
    "÷",
    "√",
    "∞",
    "±",
    "≠",
    "≈",
    "∑",
    "∫",
    "π",
    "∆",
    "∂",
    "€",
    "£",
    "¥",
    "₹",
    "₽",
    "₩",
    "₫",
    "₦",
    ".",
    ",",
    ";",
    ":",
    "'",
    '"',
    "(",
    ")",
    "[",
    "]",
  ];

  {
    /* Checks to make sure that the password contains an element from an array. */
  }
  function apply(arr, val) {
    for (let a of arr) {
      if (val.includes(a)) {
        return true;
      }
    }
    return false;
  }
  {
    /* Regex expression for ensuring that the email is in the right format. */
  }
  function rightFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  {
    /* Sets emails to target values. */
  }
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailMsg(
      !rightFormat(event.target.value)
        ? "Email needs to have a prefix, @, domain and then .edu."
        : ""
    );
  };

  {
    /* Updates the new password message for character check and length check as and when the user is adding a new password. */
  }
  const handlePasswordChange = (event) => {
    {
      /* Takes in the value. */
    }
    const value = event.target.value;
    {
      /* Apply function is created for symbols, uppercase, lowercase and numbers. For each apply function, a check happens to make sure that at least one of each: uppercase, lowercase, symbol, and numbers are present. */
    }
    const booleans = [
      apply(symbols, value),
      apply(uppercase, value),
      apply(lowercase, value),
      apply(numbers, value),
    ];
    {
      /* Setting the new password, the new password length check message, as well as the new password character check message. */
    }
    setNewPassword(value);
    setNewPasswordMsg(
      value.length < 12 ? "Length needs to be at least 12 characters." : ""
    );
    setNewPasswordMsgCharacters(
      booleans.includes(false)
        ? "Needs to contains uppercase and lowercase characters, numbers, and symbols."
        : ""
    );
  };
  const handleConfPasswordChange = (event) => {
    {
      /* Takes in the value. */
    }
    const value = event.target.value;
    {
      /* Sets the confirmed password and message depending on whether the confirm password is the same as the new password. */
    }
    setConfirmedPassword(value);
    setConfirmedPasswordMsg(
      value !== newPassword
        ? "Password should be the same as the original."
        : "All set. Have fun."
    );
    console.log(value + "::" + newPassword + "::::" + value !== newPassword);
    {
      /* Enables button if message says "All set. Have fun.". Else, keep the button disabled. */
    }
    setIsButtonDisabled(value !== newPassword && emailMsg === "");
  };

  {
    /* Shows the two factors only if the checkbox has been entered. */
  }
  const handleCheckboxChange = (event) => {
    setShowTwoFactor(event.target.checked);
  };

  {
    /* Adds a new user to the list of registered users, but does not if they are an existing user. */
  }
  const addRegisteredUser = (emailAddress, password) => {
    let userExists = false;
    for (let i = 0; i < registeredUsers.length; i++) {
      for (const [email, pass] of Object.entries(registeredUsers[i])) {
        if (email === emailAddress) {
          userExists = true;
          alert("This user currently exists. Please use the Login page."); // Alerts when the user already exists.
        }
      }
    }
    if (!userExists) {
      registeredUsers.push({ [emailAddress]: password }); // Adds the new user to the list.
      console.log(registeredUsers);
    }
  };

  return (
    <div className="form-input">
      {/* Creates an account and gives space for username and password. */}
      <h1 className="title">Create an Account</h1>
      <h3>Please create a username and password.</h3>
      <label>Email</label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter email"
      />
      <p>{emailMsg}</p>
      <label>Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={handlePasswordChange}
        placeholder="Enter new password"
      />
      <p>{newPasswordMsg}</p>
      <p>{newPasswordMsgCharacters}</p>
      <label>Confirm Password</label>
      <input
        type="password"
        value={confirmedPassword}
        onChange={handleConfPasswordChange}
        placeholder="Re-enter password"
      />
      <p>{confirmedPasswordMsg}</p>
      <div className="remember-me">
        {/* Basically asks you for two-factor authentication. */}
        <p>Would you like to enable 2 factor authentication?</p>
        <input
          type="checkbox"
          id="remember"
          checked={showTwoFactor}
          onChange={handleCheckboxChange}
        />
        {/* If checked, gives you a label to enable two factor authentication. */}
        <label htmlFor="remember">Enable 2 factor Authentication</label>
      </div>
      {/* Shows two factor only if two factor has been set to true. */}
      {showTwoFactor && <TwoFactor />}
      <div className="login">
        {/* Gives you a chance to login if you already have the given account. */}
        <span>
          Already have an account?<Link to="/">Login</Link>
        </span>
      </div>
      <div id="buttons">
        {/* Gives you chance to create account. */}
        <button
          onClick={() => addRegisteredUser(email, newPassword)}
          disabled={isButtonDisabled}
        >
          Create Account
        </button>
        {/* Gives you chance to refresh if login is being done. */}
        <button id="refreshButton" type="refresh">
          Refresh
        </button>
      </div>
    </div>
  );
}

export default Registration;
