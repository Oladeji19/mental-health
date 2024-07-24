import { useState } from "react";

function Journal() {
   {/* Created state variables for array as well as input_val */}
   const [array, setArr] = useState([]);
   const [input_val, setInputVal] = useState("");

   {/* Sets the input for the text area and saves the textbox for adding. */}
   const handleInputChange = (e) => {
    setInputVal(e.target.value);
    console.log(e.target.value);

   };

   {/* Upon submitting the thought, it gets added to the main page. */}
   const handleSubmit = (e) => {
    e.preventDefault();
    setArr(oldArray=>[input_val,...oldArray]);
    console.log(array);

   };
   return (
      <div className="journal">
        {/* Journal title is being demonstrated. */}
        <h1>Journal Time</h1>
        <h3>Welcome to the journal webpage. Write whatever thoughts you feel like sharing.</h3>
        {/* Submit button. Adds the thought to the main page upon click. */}
        <form onSubmit={handleSubmit}>
            <textarea type="text" value={input_val} onChange={handleInputChange}></textarea>
            <br></br>
            <br></br>
            <button type="submit">Submit</button>
        </form>
        {/* Actually responsible for printing out everything in the array. */}
        <div className="array-thoughts">
            {array.map((item)=><div className="thought">{item}</div>)}
        </div>
      </div>
   );
}

export default Journal;
