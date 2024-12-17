import React, { useContext } from "react";
import { signInWithGoogle } from "../../src/firebase";
import { UserContext } from "../../src/UserContext";
import { FaLeaf, FaGoogle } from "react-icons/fa";
import "./LoginPage.css";

const LoginPage = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("UserContext must be used within a UserProvider.");
  }

  const { user, loading } = context;

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      alert('Login Succesfull !!. Refresh the Page.')
    } catch (error) {
      console.error("Error logging in: ", error.message);
    }
  };

  if (loading)
    return (
      <div className="Loader-container">
        <div className="Loader"></div>
        <p className="Loader-text">Loading...</p>
      </div>
    );

  if (user)
    return (
      <div className="Container">
        <div className="Welcome-box">
          <FaLeaf className="Welcome-icon" />
          <h1>Welcome, {user.name}!</h1>
          <p className="event-message">
            Thank you for joining Nature Nexus Quest, organized by PRAKRITI - Techno Environmental Club, NIT Durgapur!
          </p>
        </div>
      </div>
    );

  return (
    <div className="Container">
      <div className="login-box">
        <FaLeaf className="login-icon" />
        <h1>Welcome to Nature Nexus Quest</h1>
        <p className="event-message">
          An event by PRAKRITI - Techno Environmental Club, NIT Durgapur.
        </p>
        <div className="login-button" onClick={handleLogin}>
          <FaGoogle/>Login with Google
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
