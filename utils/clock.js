// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase configuration (replace with your Firebase project config)
const firebaseConfig = {
    apiKey: "AIzaSyD9mZBRJc3LNW3PXxxULSnMIX8-aZnSYBU",
    authDomain: "nature-nexus-quest-9e48f.firebaseapp.com",
    projectId: "nature-nexus-quest-9e48f",
    storageBucket: "nature-nexus-quest-9e48f.firebasestorage.app",
    messagingSenderId: "829162573230",
    appId: "1:829162573230:web:db2c259b903fd46e3d8c3f"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addEventClock() {
  try {
    // Reference to the document in 'clock' collection
    const eventDocRef = doc(db, "clock", "event");

    // Data for the event document (IST Time)
    const eventData = {
      startTime: "2024-12-15T09:00:00+05:30", // Replace with your event start time in IST
      endTime: "2024-12-15T12:00:00+05:30"    // Replace with your event end time in IST
    };

    // Add the document to Firestore
    await setDoc(eventDocRef, eventData);

    console.log("Event time added successfully!");
  } catch (error) {
    console.error("Error adding event time:", error);
  }
}

// Run the function
addEventClock();
