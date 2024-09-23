import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import MapboxMap from "./components/MapboxMap";
import Roadmap from "./components/Roadmap";
import LitePaper from "./components/LitePaper";
import WhitePaper from "./components/WhitePaper";
import DocPage from "./components/documentation";
import Header from "./components/Header"; // Import the Header component
import styles from './App.module.css';

const App = () => {
  const [center, setCenter] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [inputActive, setInputActive] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState("");
  const [typedText, setTypedText] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const isFirstKeyPressAfterSearch = useRef(false);
  const inputRef = useRef(null);
  const location = useLocation();
  const [index, setIndex] = useState(0);
  const promptText = "WHERE ARE YOU HEADED TO?";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleStartClick = () => {
    if (!inputActive) {
      setInputActive(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  // Prompt appears in a "typing" effect
  useEffect(() => {
    let addChar;
    function tick() {
      setTypedText((prev) => prev + promptText[index]);
      // console.log(promptText[index.current], index.current);
      setIndex((prev) => prev + 1);
    }
    if (index < promptText.length && !hasSearched && inputActive) {
      addChar = setInterval(tick, 100);
    }
    return () => clearInterval(addChar);
  }, [typedText, inputActive, hasSearched]);

  const handleSearch = async (newQuery) => {
    if (!hasSearched) {
      setHasSearched(true);
    }
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(newQuery)}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();
      const { center, place_name } = data.features[0];
      setCenter(center);
      setSearchPerformed(true);
      setQuery(place_name);
      isFirstKeyPressAfterSearch.current = true;
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const newQuery = query.trim();
      if (newQuery) {
        handleSearch(newQuery);
      }
    } else if (isFirstKeyPressAfterSearch.current) {
      setQuery(""); // Clear query for new input
      isFirstKeyPressAfterSearch.current = false;
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (document.activeElement !== inputRef.current && inputActive) {
        inputRef.current.focus();
        if (isFirstKeyPressAfterSearch.current) {
          setQuery(""); // Clear query if needed
          isFirstKeyPressAfterSearch.current = false;
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [inputActive]);

  const isLandingPage = location.pathname === "/";

  return (
    <div className={styles.appContainer}>
      <Header isLandingPage={isLandingPage} isMobile={isMobile} /> {/* Use Header component */}

      <Routes>
        <Route path="/" element={
          <div className={styles.landingContainer} onClick={handleStartClick}>
            <MapboxMap position={center} searchPerformed={searchPerformed} allowInteraction={inputActive} />
            {!inputActive && !hasSearched && <div className={styles.title}>STAKE.CITY</div>} {/* Added title */}
            {inputActive && !hasSearched && <h1 className={styles.prompt}>{typedText}</h1>}
            <div className={`${styles.inputContainer} ${hasSearched ? styles.inactive : ''}`}>
              {!inputActive && <div className={styles.startButton}>START</div>}
              {inputActive && (
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={styles.input}
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
              )}
            </div>
          </div>
        } />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/lite-paper" element={<LitePaper />} />
        <Route path="/white-paper" element={<WhitePaper />} />
        <Route path="/documentation" element={<DocPage />} />
      </Routes>
    </div>
  );
};

export default App;
