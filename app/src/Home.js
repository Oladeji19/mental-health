import "./App.css";
import NavBar from "./NavBar.js";
import sunset from "./assets/sunset-icon.png";
import sea from "./assets/sea-icon.png";

function Home() {
  return (
    <div className="home">
      <div className="our-mission">
        <img className="mission-image" src={sunset} alt="Sunset Icon" />
        <div className="mission-msg">
          <h1 className="title1">Our Mission</h1>
          <p>
            Our goal is to create a safe environment with activities for
            everyone to deal with challenges in life better.
          </p>
        </div>
      </div>
      <div className="purpose">
        <div className="purpose-msg">
          <h1 className="purpose-title">The Purpose</h1>
          <p>
            Daily life tends to get busy, and routinely, we can lose track of
            what's important to us. Taking some time out of your day with our
            activities can help. We also want to improve our space by allowing
            everyone to input their recommendations.
          </p>
        </div>
        <img className="purpose-image" src={sea} alt="Sea Icon" />
      </div>
    </div>
  );
}

export default Home;
