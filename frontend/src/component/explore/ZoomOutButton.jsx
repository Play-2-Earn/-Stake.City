import React from 'react';
import '../styles/zoomOutButton.css'; // Import the CSS for the button

const ZoomOutButton = ({ onZoomReset }) => {
  return (
    <div className="zoom-out-button" onClick={onZoomReset}>
      ⤢ {/* Zoom out symbol */}
    </div>
  );
};

export default ZoomOutButton;
