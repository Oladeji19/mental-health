import "./App.css";
import sunset from "./assets/sunset-icon.png";
import sea from "./assets/sea-icon.png";

function Home() {
  return (
    <div className="home">
      <div className="our-mission">
        {/* First picture on the home page */}
        <img className="mission-image" src={sunset} alt="Sunset Icon" />
        <div className="mission-msg">
          {/* The mission statement */}
          <h1 className="title1">Our Mission</h1>
          <p>
            Our goal is to create a safe environment with activities for
            everyone to deal with challenges in life better.
          </p>
        </div>
      </div>
      <div className="purpose">
        {/* Area for purpose statement */}
        <div className="purpose-msg">
          {/* Purpose */}
          <h1 className="purpose-title">The Purpose</h1>
          <p>
            Daily life tends to get busy, and routinely, we can lose track of
            what's important to us. Taking some time out of your day with our
            activities can help. We also want to improve our space by allowing
            everyone to input their recommendations.
          </p>
        </div>
        {/* 2nd picture on the home page */}
        <img className="purpose-image" src={sea} alt="Sea Icon" />
      </div>
    </div>
  );
}

export default Home;
