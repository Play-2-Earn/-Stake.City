import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import MapboxMap from './components/MapboxMap';

const App = () => {
  const [center, setCenter] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // State for showing the search bar

  const handleSearch = (location) => {
    setCenter(location);
    setSearchPerformed(true); // Mark that a search has been performed
  };

  const handleStartClick = () => {
    setShowSearch(true); // Show the search input when clicked anywhere
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh'}} onClick={handleStartClick}>
      <MapboxMap 
        position={center} 
        searchPerformed={searchPerformed} 
        showControls={showSearch} // Pass showControls based on showSearch
      />
      <h1 style={{
        position: 'absolute',
        top: '5px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.25)', // Transparent text
        fontSize: '98px',
        textAlign: 'center',
        zIndex: 0,
        pointerEvents: 'none' // Allow interactions to pass through
      }}>
        STAKE.CITY
      </h1>
      {!showSearch && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'rgba(255, 255, 255, 0.7)', // Transparent text
          fontSize: '48px',
          zIndex: 10,
        }}>
          START
        </div>
      )}
      {!showSearch && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 5,
          cursor: 'pointer' 
        }} />
      )}
      {showSearch && (
        <SearchBar 
          onSearch={handleSearch} 
          style={{ 
            position: 'absolute', 
            bottom: '20px', // Position the search bar at the bottom
            left: '50%', 
            transform: 'translateX(-50%)',
            width: '45%', 
            maxWidth: '400px', 
            zIndex: 10, 
            padding: '10px', 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' 
          }} 
        />
      )}
    </div>
  );
};

export default App;
