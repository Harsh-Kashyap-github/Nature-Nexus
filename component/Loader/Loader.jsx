import React from 'react';
import './Loader.css';
import { FaLeaf } from 'react-icons/fa'; // Install react-icons if not installed

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="center-icon">
          <FaLeaf />
        </div>
      </div>
    </div>
  );
};

export default Loader;
