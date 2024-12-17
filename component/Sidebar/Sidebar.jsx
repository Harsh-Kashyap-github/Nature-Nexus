import React, { useContext } from 'react';
import './SidebarStyles.css';
const Sidebar = ({ isOpen, onClose, user ,setActiveScreen }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="closebtn" onClick={onClose}>
        &times;
      </button>
      <h2>NATURE NEXUS</h2>
      {user && (
        <div className="user-info">
          <h3>Welcome, {user.name}</h3>
          <h4>Total Score:{user.totalScore}</h4>
        </div>
      )}
      <ul className="menu">
        <li onClick={()=>{setActiveScreen('playground')
                          onClose()}}>Playground</li>
        <li onClick={()=>{setActiveScreen('leaderboard') 
                          onClose()}}>LeaderBoard</li>
        <li onClick={()=>{setActiveScreen('rules') 
                          onClose()}}>Rules</li>
        <li onClick={()=>{setActiveScreen('about') 
                          onClose()}}>About</li>
      </ul>
    </div>
  );
};

export default Sidebar;
