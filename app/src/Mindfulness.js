import "./App.css";

function Mindfulness() {
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
        <input type="text" /><br></br>
        {/* Labeling the date */}
        <label className="date">Date</label>
        <input type="text" /><br></br>
        {/* Labeling the feelings */}
        <label className="feelings">How are you feeling?</label>
        {/* Dropdown of all the possible feelings */}
        <select id="myDropdown">
          <option>Unhappy</option>
          <option>Fear</option>
          <option>Jealous</option>
          <option>Boredom</option>
          <option>Embarrassed</option>
        </select>
        <br></br>
        <label className="reason">Reason</label>
        <select id="reason">
          <option>Worldwide Issues</option>
          <option>Work Issues</option>
          <option>Relationship Issues</option>
          <option>Family Issues</option>
          <option>Other</option>
        </select>
        <br></br>
        {/*Add more dropdowns for other feelings as needed*/}

        {/*Allows you to type whatever is needed to be typed.*/}
        <label>Type anything you want here.</label>
        <textarea></textarea>
        <br></br>
        {/*Uses button for submission*/}
        <button>Submit</button>
      </form>
    </>
  );
}

export default Mindfulness;
