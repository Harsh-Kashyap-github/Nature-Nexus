import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="spinner-ring"></div>
        <div className="spinner-ring spinner-ring-2"></div>
        <div className="spinner-ring spinner-ring-3"></div>
      </div>
      <div className="center-text">PRAKRITI</div>
    </div>
  );
};

export default Loader;
