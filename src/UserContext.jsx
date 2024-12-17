import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventTimes, setEventTimes] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        try {
          // Fetch user data
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = { uid: currentUser.uid, ...userDoc.data() };
            setUser(userData);

            // Fetch event times from "clock/event"
            const eventDoc = await getDoc(doc(db, "clock", "event"));
            if (eventDoc.exists()) {
              setEventTimes(eventDoc.data());
            } else {
              console.warn("No event document found in clock collection.");
            }
          } else {
            console.warn("User document does not exist.");
          }
        } catch (error) {
          console.error("Error fetching user or event data:", error);
        }
      } else {
        setUser(null);
        setEventTimes(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, eventTimes}}>
      {children}
    </UserContext.Provider>
  );
};
