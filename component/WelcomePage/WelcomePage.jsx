import React, { useContext } from "react";
import { UserContext } from "../../src/UserContext";
import "./WelcomePage.css";
import Countdown from "../Countdown/Countdown";

function WelcomePage({ userName, onStart }) {
  const { eventTimes } = useContext(UserContext);

  const handleStartClick = () => {
    if (!eventTimes) {
      alert("Event times are not available.");
      return;
    }

    const currentTime = new Date();
    const startTime = new Date(eventTimes.startTime);
    const endTime = new Date(eventTimes.endTime);

    if (currentTime >= startTime && currentTime <= endTime) {
      onStart();
  } else {
      const timeLeft = currentTime < startTime ? startTime - currentTime : endTime - currentTime;
  
      if (currentTime > endTime) {
          alert("The event has ended.");
      } else {
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          alert(`The event will start in ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`);
      }
  }
  
  };

  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <h1>Welcome, {userName}!</h1>
        {/* <p>Get ready to start your Nature Nexus Quest!</p> */}
        <p> Are you ready to kick off an exciting journey toward a greener tomorrow?</p>
        <p>Test your knowledge across four rounds and earn points for every correct answer and see if you can emerge as</p> 
        <p>the ultimate eco-champion!"</p>
        <Countdown/>
        <button className="start-button" onClick={handleStartClick}>
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;