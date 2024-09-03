import { useEffect, useState, useContext } from "react";
import { context } from "./App";


function Healthcare() {
  const [sleepGoals, setSleepGoals] = useState(null);
  const [meditationGoals, setMeditationGoals] = useState(null);
  const [exerciseGoals, setExerciseGoals] = useState(null);
  const [message, setMessage] = useState(null);
  const [messagesMemo, setMessagesMemo] = useState(null);

  const [sleepMemo, setSleepMemo] = useState(null);
  const [meditationMemo, setMeditationMemo] = useState(null);
  const [exerciseMemo, setExerciseMemo] = useState(null);
  const [showEnter, setshowEnter] = useState(true);
  const [listOfLast7sleep, setlistOfLast7sleep] = useState([]);
  const [listOfLast7meditation, setlistOfLast7meditation] = useState([]);
  const [listOfLast7exercise, setlistOfLast7exercise] = useState([]);

  const [username_, setUsername_] = useContext(context);

useEffect(async() => {
  console.log(typeof username_)
  const response = await fetch("http://localhost:5001/check_for_availability", 
  {method:'POST', body: JSON.stringify(
  {username: "madhav"}
    )});
  if(response.json.can_enter_information === true){
    setshowEnter(false);
  }
  else{
    setshowEnter(true);
    setlistOfLast7sleep(response.json.sleep_data);
    setlistOfLast7meditation(response.json.exercise_data);
    setlistOfLast7exercise(response.json.meditation_data);
  }
}, [])


  const handleGoals = async () => {
    if (
      !(sleepGoals != null && sleepGoals <= 0) &&
      !(meditationGoals != null && meditationGoals <= 0) &&
      !(exerciseGoals != null && exerciseGoals <= 0)
    ) {
      alert("All inputs must be greater than or equal to 0.");
    } else {
      try {
        const response = await fetch("http://localhost:5001/set_goals", {
          body: JSON.stringify({
            sleep_goals: sleepGoals,
            exercise: exerciseGoals,
            meditation: meditationGoals,
            username: username_,
          }),
        });
        const status = response.json.message;
        setMessage(status);
      } catch {}
    }
  };

  const handleMemo = async () => {
    if (
      !(sleepMemo != null && sleepMemo <= 0) &&
      !(meditationMemo != null && meditationMemo <= 0) &&
      !(exerciseMemo != null && exerciseMemo <= 0)
    ) {
      alert("All inputs must be greater than or equal to 0.");
    } else {
      try {
        const response = await fetch("http://localhost:5001/check_goals", {
          body: JSON.stringify({
            sleep: sleepMemo,
            exercise: exerciseGoals,
            meditation: meditationGoals,
            username: username_,
          }),
        });
        const status = response.json.message;
        if (status === "Success") {
          setMessagesMemo(response.json.feedback);
        }
      } catch {}
    }
  };

  return (
    <div className="healthcare">
      {/* Welcome page. */}
      <div className="welcome-page">
        Welcome to the Healthcare API. Here are some basic questions.
      </div>
      <br></br>
      <div className="healthcare-info">
        <form className="goals" onSubmit={handleGoals}>
          <h3>Goals</h3>
          {/* Asks about the hours of sleep. */}

          <div className="sleep">
            How many hours of sleep do you want to achieve?
          </div>
          <input
            type="text"
            value={sleepGoals}
            onChange={(e) => setSleepGoals(e.target.value)}
          ></input>
          <br></br>
          {/* Asks about the hours of meditation. */}
          <div className="meditation">
            How many minutes do you aim to spend meditation per day?
          </div>
          <input
            type="text"
            value={meditationGoals}
            onChange={(e) => setMeditationGoals(e.target.value)}
          ></input>
          <br></br>
          {/* Asks about the hours you spend working. */}
          <div className="exercise">
            How many minutes do you aim to work out per day?
          </div>
          <input
            type="text"
            value={exerciseGoals}
            onChange={(e) => setExerciseGoals(e.target.value)}
          ></input>
          <br></br>
          <button type="submit">Submit</button>
          {message && <h2>{message}</h2>}
        </form>

        {showEnter && !messagesMemo && (
          <div>
            <h3>Memo</h3>
            {/* Asks about the hours of sleep. */}
            <div className="sleep">Hours of sleep:</div>
            <input
              type="text"
              value={sleepMemo}
              onChange={(e) => setSleepMemo(e.target.value)}
            ></input>
            <br></br>
            {/* Asks about the hours of meditation. */}
            <div class="meditation">Minutes of meditation:</div>
            <input
              type="text"
              value={meditationMemo}
              onChange={(e) => setMeditationMemo(e.target.value)}
            ></input>
            <br></br>
            {/* Asks about the hours you spend working. */}
            <div className="exercise">
              How many minutes do you aim to work out per day?
            </div>
            <input
              type="text"
              value={exerciseMemo}
              onChange={(e) => setExerciseMemo(e.target.value)}
            ></input>
            <br></br>
            <button type="submit" onClick={handleMemo}>Submit</button>
          </div>
        )}
        {messagesMemo && 
          <div className="memo">
            {messagesMemo.map((message, index) => {<h2>{message}</h2>})}
          </div>
        }
        <br></br>
      </div>
      <div>
        {listOfLast7sleep.map((message,index) => {<h2>Day {index}: {message}</h2>})}
        <br />
        {listOfLast7meditation.map((message,index) => {<h2>Day {index}: {message}</h2>})}
        <br />
        {listOfLast7exercise.map((message,index) => {<h2>Day {index}: {message}</h2>})}
      </div>
    </div>
  );
}

export default Healthcare;
