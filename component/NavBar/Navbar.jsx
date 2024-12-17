import React, { useState } from 'react';
import Clock from '../Clock/Clock';
import Sidebar from '../Sidebar/Sidebar';
import RulesPopup from '../popup/RulesPopup';
import './NavbarStyles.css';

const Navbar = ({toggleSidebar}) => {
 

  return (
    <div>
      <div className="navbar">
        <div className="hamburger" onClick={toggleSidebar}>
          &#9776;
        </div>
        <div className="title">Nature Nexus</div>
        <div className="clock">
          <Clock />
        </div>
      </div>
     
    </div>
  );
};

export default Navbar;
