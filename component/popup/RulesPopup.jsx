import React, { useEffect, useState } from 'react';
import './RulesPopupStyles.css';

const RulesPopup = ({openPopUp,content}) => {
  const [isHidden,setIsHidden]=useState(false)
  useEffect(()=>{
    if (openPopUp){
      setIsHidden(false)}
},[openPopUp])

return (
  <div className={`rulesPopup ${(isHidden) ? 'hide' : ''}`}>
    <div className="rulesContent">
      <button className="closebtn" onClick={() => setIsHidden(true)}>
        &times;
      </button>
{
  content
}
    </div>
  </div>
);
}

export default RulesPopup;

