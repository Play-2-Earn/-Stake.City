import React from 'react';
import '../styles/zoomoutbutton.css';

const ZoomOutButton = ({ onZoomReset }) => {
  return (
    <div className="zoom-out-button" onClick={onZoomReset}>
      ⤢ {/* Zoom out symbol */}
    </div>
  );
};

export default ZoomOutButton;
