import "./App.css";

function Mindfulness(){
    return(
        <>
        <h1>Venting Chat Room</h1>
        { /* Gives users instructions on giving information as well as the problem. */ }
   
        <p>Please write your name, today's date, your feelings. Feel free to write as many lines as possible.</p>
        { /* Labeling the name */ }
        <label>Name</label>
        <input type="text"/>
        { /* Labeling the date */ }
        <label>Date</label>
        <input type="text"/>
        { /* Labeling the feelings */ }
        <label for="feelings">How are you feeling?</label>
        { /* Dropdown of all the possible feelings */ }
        <select id="myDropdown" onchange="showInnerDropdown()">
            <option>Unhappy</option>
            <option>Fear</option>
            <option>Jealous</option>
            <option>Boredom</option>
            <option>Embarrassed</option>
        </select>
        <div id="secondaryDropdowns">
            {/*All The Possible Types Of Reasons That People Have The Particular Feeling. Makes it easier for
            recommendation algorithm to decide which people need to step in. Health issues would require a doctor for instance.*/}
        <select id="unhappyDropdown" class="hidden">
                <option>Grief</option>
                <option>Health Issues</option>
                <option>Disappointments</option>
                <option>Family Issues</option>
                <option>Work Issues</option>
                <option>Loneliness</option>
                <option>Worldwide Issues</option>
            </select>

            <select id="boredDropdown" class="hidden">
                <option>Boring Tasks</option>
                <option>Social Tasks</option>
                <option>Delays</option>
                <option>Weather Conditions</option>
            </select>

            <select id="fearDropdown" class="hidden">
                <option>Health</option>
                <option>Phobias</option>
                <option>Failure</option>
                <option>Change</option>
                <option>Environmental Threats</option>
                <option>Worldwide Threats</option>
                <option>Social Fear</option>
            </select><select id="jealousDropdown" class="hidden">
                <option>Popularity</option>
                <option>Relationships</option>
                <option>Appearances</option>
                <option>Talent</option>
                <option>Skill</option>
                <option>Traits</option>
            </select>

            <select id="embarrassedDropdown" class="hidden">
                <option>Social Purpose</option>
                <option>Appearances</option>
                <option>Behaviors</option>
                <option>Accidents</option>
            </select>
            {/*Add more dropdowns for other feelings as needed*/}
            
        </div>

        
        {/*Allows you to type whatever is needed to be typed.*/}
        <label>Type anything you want here.</label>
        <textarea></textarea>
        
        {/*Uses button for submission*/}
        <button>Submit</button>
            <div>test</div>
    </>
    );
}

export default Mindfulness;
