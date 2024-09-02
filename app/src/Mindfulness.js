import "./App.css";
import { useState } from "react";

function Mindfulness() {
  {
    /* Create the state variables for all of the given input. */
  }
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [reason, setReason] = useState("");
  const [anything, setAnything] = useState("");
  const [selectedExperience, setSelectedExperience] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [additionalFeeling, setAdditionalFeeling] = useState("");
  const [language, setLanguage] = useState("");

  {
    /* Tracks everytime a user enters a character in the "Name" section */
  }
  const handleExperienceChange = (e) => {
    setSelectedExperience(e.target.value);
  };

  const handleOptionChange = (event) => {
    setSelectedFeeling(event.target.value);
    setShowInput(event.target.value === "Other");
  };
  {
    /* Tracks everytime a user enters a character in the "Name" section */
  }
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  {
    /* Tracks everytime a user enters a character in the "Date" section */
  }
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  {
    /* Tracks everytime a user enters a character in the "Enter the other feeling" section */
  }
  const handleAdditionalFeelingChange = (e) => {
    setAdditionalFeeling(e.target.value);
  };
  {
    /* Tracks everytime a user enters a character in the "Reason" section */
  }
  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };
  {
    /* Tracks everytime a user enters a character in the "Vent Your Emotions" section */
  }
  const handleAnythingChange = (e) => {
    setAnything(e.target.value);
  };

  {
    /* Tracks everytime a user enters a character in the "Language" section */
  }
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <>
      <h1 className="vc-room">Venting Chat Room</h1>
      {/* Gives users instructions on giving information as well as the problem. */}

      <p>
        Please write your name, today's date, your feelings. Feel free to write
        as many lines as possible.
      </p>
      <form className="details">
        {/* Labeling the name */}
        <label className="name">Name</label>
        <input type="text" value={name} onChange={handleNameChange} />
        <br></br>
        {/* Labeling the date */}
        <label className="date">Date</label>
        <input type="text" value={date} onChange={handleDateChange} />
        <br></br>
        {/* Labeling the feelings */}
        <label className="feelings">How are you feeling?</label>
        <select
          id="feelings"
          value={selectedFeeling}
          onChange={handleOptionChange}
        >
          <option>Sad</option>
          <option>Angry</option>
          <option>Fear</option>
          <option>Envy</option>
          <option>Anxiety</option>
          <option>Bored</option>
          <option>Disgust</option>
          <option>Embarrassment</option>
          <option>Other</option>
        </select>
        <br></br>

        {showInput && (
          <div>
            <label htmlFor="additionalFeeling">Enter the other feeling:</label>
            <br></br>
            <input
              type="text"
              id="additionalFeeling"
              value={additionalFeeling}
              onChange={handleAdditionalFeelingChange}
            />
          </div>
        )}
        {/* Labeling the reason. */}
        <label className="reason">Experience</label>
        <select
          id="experience"
          value={selectedExperience}
          onChange={handleExperienceChange}
        >
          <option>Under 1 year</option>
          <option>1-5 years</option>
          <option>6-10 years</option>
          <option>11-15 years</option>
          <option>16 years and above</option>
        </select>
        <br></br>

        <label className="language">Language</label>
        <textarea
          type="text"
          value={language}
          onChange={handleLanguageChange}
        />
        <br></br>

        {/*Allows you to type whatever is needed to be typed.*/}
        <label>Vent Your Emotions</label>
        <textarea value={anything} onChange={handleAnythingChange}></textarea>
        <br></br>
        {/*Uses button for submission*/}
        <button>Submit</button>
      </form>
    </>
  );
}

export default Mindfulness;
