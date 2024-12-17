import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";

// Firebase config object
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

// Initialize Firestore
const db = getFirestore(app);

// Data to upload
const RoundFiveQuestions = [
  {
    id: 'X8FJ9D3A',
    photoPath: '../../data/photos/photo1.jpg',
    words: ['Apple'],
  },
  {
    id: 'L3KQ7T1P',
    photoPath: 'https://example.com/photo2.jpg',
    words: ['Banana', 'Tree'],
  },
  {
    id: 'N6YV2C4R',
    photoPath: 'https://example.com/photo3.jpg',
    words: ['The', 'Horse', 'Runs'],
  },
  {
    id: 'Q1ZK5L9M',
    photoPath: 'https://example.com/photo4.jpg',
    words: ['Blue', 'Planet'],
  },
  {
    id: 'T5XW3N8K',
    photoPath: 'https://example.com/photo5.jpg',
    words: ['Large', 'Animals', 'Sky'],
  },
];

const uploadQuestionsToFirebase = async () => {
  for (const question of RoundFiveQuestions) {
    try {
      // Upload the words array for each question ID
      await setDoc(doc(db, "Q&A", question.id), {
        words: question.words,
      });
      console.log(`Question with ID ${question.id} uploaded successfully!`);
    } catch (error) {
      console.error(`Error uploading question with ID ${question.id}:`, error);
    }
  }
};

// Call the function to upload the questions
uploadQuestionsToFirebase();
