import { useState } from "react";

function HealthcareAPI() {
   return (
    <div class="healthcare">
        {/* Welcome page. */}
        <div class="welcome-page">Welcome to the Healthcare API. Here are some basic questions.</div>
        <br></br>
        {/* Asks about the hours of sleep. */}
        <div class="sleep">How many hours of sleep do you want to achieve?</div>
        <input></input>
        <button>Submit</button>
        <br></br>
        {/* Asks about the hours of meditation. */}
        <div class="meditation">How much time do you spend in meditation per day?</div>
        <input></input>
        <button>Submit</button>
        <br></br>
        {/* Asks about the hours of calories. */}
        <div class="calories">How many calories do you want to intake per day?</div>
        <input></input>
        <button>Submit</button>
        <br></br>
        {/* Asks about the hours spent with family and friends. */}
        <div class="family">How much time do you spend with family and friends per day?</div>
        <input></input>
        <button>Submit</button>
        <br></br>
        {/* Asks about the hours you spend working. */}
        <div class="exercise">How much time do you spend working out per day?</div>
        <input></input>
        <button>Submit</button>
        <br></br>
        {/* Asks about the hours you spend outside. */}
        <div class="outside">How much time do you spend outside per day?</div>
        <input></input>
        <button>Submit</button>
    </div>
   );
}
export default HealthcareAPI;
