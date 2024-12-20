import React, { useState, useEffect, useContext } from "react";
import "./ClockStyles.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import { UserContext } from "../../src/UserContext";

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);

  const { user, eventTimes, setUser } = useContext(UserContext);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!eventTimes || !user) 
    {setIsVisible(false)
      return;}

    const currentTime = time.getTime();
    const start = new Date(eventTimes.startTime).getTime();
    const end = new Date(eventTimes.endTime).getTime();

    // Update visibility based on time
    if (currentTime < start || currentTime > end) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    // Handle endTime if reached
    if (currentTime >= end) {
      handleEndTime();
    }
  }, [time, eventTimes]);

  const handleEndTime = async () => {
    if (!user || user.activeRound === 5) 
    { setIsVisible(false)
      return;} // Ensure user is logged in and activeRound is not already 5

    try {
      // Update Firestore
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, { activeRound: 5 });

      // Update Context
      setUser((prevUser) => ({ ...prevUser, activeRound: 5 }));
    } catch (error) {
      console.error("Error updating active round:", error);
    }
  };

  if (!isVisible) {
    return null;
  }

  if (!eventTimes) {
    return <div>Loading event times...</div>;
  }

  const remainingTime = Math.max(
    0,
    new Date(eventTimes.endTime).getTime() - time.getTime()
  );
  const seconds = Math.floor((remainingTime / 1000) % 60);
  const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
  const hours = Math.floor((remainingTime / 1000 / 60 / 60));

  return (
    <div className="clock">
      {remainingTime > 0 ? (
        <div>
          Time Left: {hours}h {minutes}m {seconds}s
        </div>
      ) : (
        <div>End Time Reached</div>
      )}
    </div>
  );
};

export default Clock;

