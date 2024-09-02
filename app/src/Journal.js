import { useState } from "react";
import NavBar from "./NavBar";

function Journal() {
  {
    /* Created state variables for array as well as input_val */
  }
  const [array, setArr] = useState([]);
  const [input_val, setInputVal] = useState("");

  {
    /* Sets the input for the text area and saves the textbox for adding. */
  }
  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    console.log(e.target.value);
  };

  {
    /* Upon submitting the thought, it gets added to the main page. */
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setArr((oldArray) => [input_val, ...oldArray]);
    console.log(array);
  };

  {
    /* Upon the click of the journal edit button, it allows you to edit the entry in the journal page. */
  }
  const editEntry = (index) => {
    console.log(index);
    let newEntry = prompt("Edit your entry:");
    const newEntries = [...array];
    newEntries[index] = newEntry;
    setArr(newEntries);
  };

  {
    /* Upon the click of the button, the entry in the journal gets deleted. */
  }
  const deleteEntry = (index) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const newEntries = array.filter((item, i) => i !== index);
      setArr(newEntries);
    }
  };

  {
    /* Creates state variable for counting characters. */
  }
  const [charCount, setCharCount] = useState(0);

  return (
    <>
      <NavBar />
      <div className="journal">
        {/* Journal title is being demonstrated. */}
        <h1>Journal Time</h1>
        <p>
          Welcome to the journal webpage. Write whatever thoughts you feel like
          sharing.
        </p>
        {/* Submit button. Adds the thought to the main page upon click. */}
        <form className="journal-form" onSubmit={handleSubmit}>
          <textarea
            className="journal-input"
            type="text"
            value={input_val}
            onChange={(e) => {
              handleInputChange(e);
              setCharCount(e.target.value.length);
            }}
            placeholder="Insert text here"
          ></textarea>
          {charCount}
          <br></br>
          <br></br>
          <button type="submit">Submit</button>
        </form>
        {/* Actually responsible for printing out everything in the array. */}
        <div className="array-thoughts">
          {/* Creates an entry along with an edit and delete button. */}
          {array.map((item, index) => (
            <div className="thought">
              <div>Entry #{array.length - index}</div>
              <hr></hr>
              <div>{item}</div>
              <button
                className="journal-edit-button"
                onClick={() => editEntry(index)}
              >
                Edit
              </button>
              <button onClick={() => deleteEntry(index)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Journal;
