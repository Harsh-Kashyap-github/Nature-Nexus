import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Login Function
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const { user } = result;
  const userDoc = doc(db, "users", user.uid);

  const existingUser = await getDoc(userDoc);
  if (!existingUser.exists()) {
    // Set default data for new users
    await setDoc(userDoc, {
      uid:user.uid,
      email: user.email,
      displayPicUrl: user.photoURL,
      name: user.displayName,
      totalScore: 0,
      roundScore:{
        1:0,
        2:0,
        3:0,
        4:0,
      },
      roundSubmitTime:{
        1:null,
        2:null,
        3:null,
        4:null,
      },
      submitedAnswer:{
        1:null,
        2:null,
        3:null,
        4:null,
      },
      activeRound: 1,
      isGameOver:false

    });
  }

  return user;
};

export { auth, db };
