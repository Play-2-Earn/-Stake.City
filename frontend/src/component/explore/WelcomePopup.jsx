import React from 'react';
import '../styles/welcomepopup.css';  // Assuming you will create CSS here

const WelcomePopup = ({ onClose }) => {
  return (
    <div className="welcome-popup-overlay">
      <div className="welcome-popup-content">
        <h1>Welcome</h1>
        <p>
          Explore the vast open-world map, complete various missions, and unlock hidden secrets along the way. Your journey will test your agility, strategy, and decision-making skills!
        </p>
        <button className="close-popup-button" onClick={onClose}>Start Exploring</button>
      </div>
    </div>
  );
};

export default WelcomePopup;
