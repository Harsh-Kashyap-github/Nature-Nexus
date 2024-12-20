import React, { useState, useEffect, useContext } from "react";
import "./ClockStyles.css";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
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
    if (!eventTimes || !user) {
      setIsVisible(false);
      return;
    }

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
    if (!user || user.activeRound === 5) {
      setIsVisible(false);
      return;
    }

    try {
      // Update Firestore: Set activeRound to 5 and update roundSubmitTime for the 4th round
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, {
        activeRound: 5,
        [`roundSubmitTime.4`]: serverTimestamp(), // Use serverTimestamp for Firestore
      });

      // Update Context
      setUser((prevUser) => ({
        ...prevUser,
        activeRound: 5,
        roundSubmitTime: {
          ...prevUser.roundSubmitTime,
          4: { seconds: Math.floor(Date.now() / 1000) }, // Use seconds-based timestamp for context
        },
      }));
    } catch (error) {
      console.error("Error updating active round or roundSubmitTime:", error);
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

