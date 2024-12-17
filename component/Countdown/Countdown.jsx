import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../src/UserContext";
import "./Countdown.css";

function Countdown() {
  const { eventTimes } = useContext(UserContext);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!eventTimes) return;

    const startTime = new Date(eventTimes.startTime);
    const interval = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = startTime - currentTime;
      if (timeDifference <= 0) {
        clearInterval(interval);
        setTimeLeft("Event Started");
      } else {
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [eventTimes]);

  return (
    <div className="countdown-container">
      <div className="countdown-box">
        <h2>Time Left for Event:</h2>
        <p className="countdown-timer">{timeLeft || "Loading..."}</p>
      </div>
    </div>
  );
}

export default Countdown;
