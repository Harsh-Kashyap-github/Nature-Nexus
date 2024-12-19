import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9mZBRJc3LNW3PXxxULSnMIX8-aZnSYBU",
    authDomain:"nature-nexus-quest-9e48f.firebaseapp.com",
    projectId:"nature-nexus-quest-9e48f",
    storageBucket:"nature-nexus-quest-9e48f.firebasestorage.app",
    messagingSenderId:"829162573230",
    appId:"1:829162573230:web:db2c259b903fd46e3d8c3f"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Function to update users collection
const updateRoundSubmitTime = async () => {
  try {
    // Get all documents from the "users" collection
    const querySnapshot = await getDocs(collection(db, "users"));

    // Loop through each document
    querySnapshot.forEach(async (docSnapshot) => {
      const userData = docSnapshot.data();

      // Check if "roundSubmitTime" exists and has at least 4 values
      if (userData.roundSubmitTime && userData.roundSubmitTime.length >= 4) {
        // Copy the existing roundSubmitTime array and add the 5th value (same as the 4th)
        const updatedRoundSubmitTime = [...userData.roundSubmitTime];
        updatedRoundSubmitTime.push(userData.roundSubmitTime[3]);  // Set the 5th value equal to the 4th

        // Update the document in Firestore
        await updateDoc(doc(db, "users", docSnapshot.id), {
          roundSubmitTime: updatedRoundSubmitTime,
        });

        console.log(`Document with ID ${docSnapshot.id} updated successfully!`);
      }
    });
  } catch (error) {
    console.error("Error updating documents:", error);
  }
};

// Call the function to update roundSubmitTime
updateRoundSubmitTime();