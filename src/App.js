import React, { useState, useRef, useEffect } from 'react';
import MapboxMap from './components/MapboxMap';

// Configurations
const chosenFontFamily1 = 'Arial'; // Set as default, change as desired
const chosenFontFamily2 = 'Arial'; // Set as default, change as desired

const App = () => {
  const [center, setCenter] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [inputActive, setInputActive] = useState(false);
  const [query, setQuery] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const isFirstKeyPressAfterSearch = useRef(false); // Track first key press after search

  const inputRef = useRef(null);

  const handleStartClick = () => {
    if (!inputActive) {
      setShowTitle(false);
      setInputActive(true);
      setShowPrompt(true);
      setTimeout(() => {
        inputRef.current?.focus(); // Focus the input
      }, 0);
    }
  };

  const handleSearch = (location, formattedName) => {
    setCenter(location);
    setSearchPerformed(true);
    setQuery(formattedName); // Update query with the formatted location name
    isFirstKeyPressAfterSearch.current = true; // Set the flag for the first key press
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      const newQuery = query.trim();
      if (newQuery) {
        setInputActive(true);
        setShowPrompt(false);

        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(newQuery)}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`
          );
          const data = await response.json();
          const { center, place_name } = data.features[0];
          handleSearch(center, place_name);
        } catch (error) {
          console.error('Error fetching location:', error);
        }
      }
    } else if (isFirstKeyPressAfterSearch.current) {
      setQuery(''); // Clear the input on first key press after search
      isFirstKeyPressAfterSearch.current = false; // Reset the flag
    }
  };

  // Automatically focus on the input when any key is pressed
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // If no element is focused and it's not a meta key, focus on the input
      if (document.activeElement !== inputRef.current && !e.metaKey && !e.ctrlKey &&inputActive) {
        inputRef.current.focus();

        if (isFirstKeyPressAfterSearch.current) {
          setQuery(''); // Clear the input on first key press after search
          isFirstKeyPressAfterSearch.current = false; // Reset the flag
        }
      }
    };

    // Add event listener for keydown to automatically focus input
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      // Cleanup event listener
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [inputActive]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }} onClick={handleStartClick}>
      {/* Transparent overlay to block interactions */}
      {!inputActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 20,
          cursor: 'pointer',
        }} />
      )}

      <MapboxMap 
        position={center} 
        searchPerformed={searchPerformed} 
        allowInteraction={inputActive} 
      />
      
      {showTitle && (
        <h1 style={{
          position: 'absolute',
          top: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 1)',
          fontSize: '72px',
          fontWeight: 'bold',
          fontFamily: chosenFontFamily1,
          textAlign: 'center',
          zIndex: 10,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          STAKE.CITY
        </h1>
      )}

      {showPrompt && (
        <h1 style={{
          position: 'absolute',
          top: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '48px',
          fontFamily: chosenFontFamily2,
          textAlign: 'center',
          zIndex: 10,
          userSelect: 'none',
        }}>
          WHERE ARE YOU HEADED TO?
        </h1>
      )}

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          zIndex: 10,
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '48px',
          fontFamily: chosenFontFamily2,
          cursor: 'pointer',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {!inputActive && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%)',
            color: 'rgba(255, 255, 255, 0.35)',
            fontSize: '48px',
            fontFamily: chosenFontFamily2,
            cursor: 'pointer',
            }}>
            START
          </div>
        )}
        {inputActive && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{
              position: 'absolute',
              top: '85%',
              left: '50%',
              transform: 'translate(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '48px',
              fontFamily: chosenFontFamily2,
              textAlign: 'center',
              outline: 'none',
              width: '100%',
              caretColor: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 'bold',
              padding: '0 5px',
              pointerEvents: 'all',
            }}
            autoFocus
            autoComplete="off" // Disable autocomplete
            autoCorrect="off" // Disable autocorrect
            spellCheck="false" // Disable spell check
          />        
        )}
      </div>
    </div>
  );
};

export default App;
