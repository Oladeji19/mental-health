import "./App.css";
import { useState } from "react";

function Mindfulness() {
  {/* Create the state variables for all of the given input. */}
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [reason, setReason] = useState("");
  const [anything, setAnything] = useState("");
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
        <input type="text" value={name}/>
        <br></br>
        {/* Labeling the date */}
        <label className="date">Date</label>
        <input type="text" value={date}/><br></br>
        {/* Labeling the feelings */}
        <label className="feelings">How are you feeling?</label>
        <select id="feelings" value={selectedFeeling}>
           <option>Sad</option>
           <option>Angry</option>
           <option>Fear</option>
           <option>Envy</option>
           <option>Anxiety</option>
           <option>Bored</option>
           <option>Disgust</option>
           <option>Embarrassment</option>
           <option>Other</option>
        </select><br></br>
        {/* Labeling the reason. */}
        <label className="reason">Reason</label>
        <input type="text" value={reason}/><br></br>

        {/*Allows you to type whatever is needed to be typed.*/}
        <label>Type anything you want here.</label>
        <textarea value={anything}></textarea>
        <br></br>
        {/*Uses button for submission*/}
        <button>Submit</button>
      </form>
    </>
  );
}

export default Mindfulness;
