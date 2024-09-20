import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import MapboxMap from './components/MapboxMap';
import logo from './assets/logo7.png'; // Adjust the path as needed
import Roadmap from './components/Roadmap';
import LightPaper from './components/LightPaper';
import WhitePaper from './components/WhitePaper';

// Configurations
const chosenFontFamily1 = 'Arial';
const chosenFontFamily2 = 'Arial';

const App = () => {
  const [center, setCenter] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [inputActive, setInputActive] = useState(false);
  const [query, setQuery] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const isFirstKeyPressAfterSearch = useRef(false);
  const inputRef = useRef(null);
  const location = useLocation();

  const handleStartClick = () => {
    if (!inputActive) {
      setShowTitle(false);
      setInputActive(true);
      setShowPrompt(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleSearch = (location, formattedName) => {
    setCenter(location);
    setSearchPerformed(true);
    setQuery(formattedName);
    isFirstKeyPressAfterSearch.current = true;
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
      setQuery('');
      isFirstKeyPressAfterSearch.current = false;
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (document.activeElement !== inputRef.current && !e.metaKey && !e.ctrlKey && inputActive) {
        inputRef.current.focus();
        if (isFirstKeyPressAfterSearch.current) {
          setQuery('');
          isFirstKeyPressAfterSearch.current = false;
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [inputActive]);

  const isLandingPage = location.pathname === '/';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/*header bar*/}
      {isLandingPage && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: 0,
          right: 0,
          height: '100px',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 20px',
          backgroundColor: 'transparent',
          zIndex: 30,
        }}>
          {/* Logo */}
          <img src={logo} alt="Logo" style={{ width: '100px', height: '100px'}} />
          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/roadmap">
              <button style={buttonStyle}>Roadmap</button>
            </Link>
            <Link to="/light-paper">
              <button style={buttonStyle}>Light Paper</button>
            </Link>
            <Link to="/white-paper">
              <button style={buttonStyle}>White Paper</button>
            </Link>
          </div>
        </div>
      )}

      {/* Render Routes */}
      <Routes>
        <Route path="/" element={
          <div style={{ position: 'relative', width: '100%', height: '100vh' }} onClick={handleStartClick}>
            <MapboxMap position={center} searchPerformed={searchPerformed} allowInteraction={inputActive} />
            
            {showTitle && (
              <h1 style={{
                position: 'absolute',
                top: '5px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255, 255, 255, 1)',
                fontSize: '72px',
                fontWeight: 'bold',
                fontFamily: 'Arial',
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
                fontFamily: 'Arial',
                textAlign: 'center',
                zIndex: 10,
                userSelect: 'none',
              }}>
                WHERE ARE YOU HEADED TO?
              </h1>
            )}

            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              zIndex: 10,
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '48px',
              fontFamily: 'Arial',
              cursor: 'pointer',
              userSelect: 'none',
              pointerEvents: 'none',
            }}>
              {!inputActive && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%)',
                  color: 'rgba(255, 255, 255, 0.35)',
                  fontSize: '48px',
                  fontFamily: 'Arial',
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
                    fontFamily: 'Arial',
                    textAlign: 'center',
                    outline: 'none',
                    width: '100%',
                    caretColor: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 'bold',
                    padding: '0 5px',
                    pointerEvents: 'all',
                  }}
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />        
              )}
            </div>
          </div>
        } />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/light-paper" element={<LightPaper />} />
        <Route path="/white-paper" element={<WhitePaper />} />
      </Routes>
    </div>
  );
};

// Button style
const buttonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  padding: '10px 15px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default App;