import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import MapboxMap from "./components/MapboxMap";
import logo from "./assets/logo7.png";
import Roadmap from "./components/Roadmap";
import LightPaper from "./components/LightPaper";
import WhitePaper from "./components/WhitePaper";
import DocPage from "./components/documentation";
import { Menu } from "lucide-react";

const App = () => {
  const [center, setCenter] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [inputActive, setInputActive] = useState(false);
  const [query, setQuery] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
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
    if (e.key === "Enter") {
      const newQuery = query.trim();
      if (newQuery) {
        setInputActive(true);
        setShowPrompt(false);
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              newQuery
            )}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`
          );
          const data = await response.json();
          const { center, place_name } = data.features[0];
          handleSearch(center, place_name);
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      }
    } else if (isFirstKeyPressAfterSearch.current) {
      setQuery("");
      isFirstKeyPressAfterSearch.current = false;
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (
        document.activeElement !== inputRef.current &&
        !e.metaKey &&
        !e.ctrlKey &&
        inputActive
      ) {
        inputRef.current.focus();
        if (isFirstKeyPressAfterSearch.current) {
          setQuery("");
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
  const isMobile = window.innerWidth <= 768;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "auto",
      }}
    >
      {isLandingPage && (
        <div style={headerStyle}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "80px", height: "80px" }}
          />
          {isMobile ? (
            <div>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={mobileMenuButtonStyle}
              >
                <Menu size={24} />
              </button>
              {menuOpen && (
                <div style={mobileMenuStyle}>
                  <Link to="/roadmap" style={mobileLinkStyle}>
                    Roadmap
                  </Link>
                  <Link to="/light-paper" style={mobileLinkStyle}>
                    Light Paper
                  </Link>
                  <Link to="/white-paper" style={mobileLinkStyle}>
                    White Paper
                  </Link>
                  <Link to="/Documentation" style={mobileLinkStyle}>
                    Documentation
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to="/roadmap">
                <button style={buttonStyle}>Roadmap</button>
              </Link>
              <Link to="/light-paper">
                <button style={buttonStyle}>Light Paper</button>
              </Link>
              <Link to="/white-paper">
                <button style={buttonStyle}>White Paper</button>
              </Link>
              <Link to="/Documentation">
                <button style={buttonStyle}>Documentation</button>
              </Link>
            </div>
          )}
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <div
              style={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",
              }}
            >
              <div
                style={{ height: "100vh", position: "relative" }}
                onClick={handleStartClick}
              >
                <MapboxMap
                  position={center}
                  searchPerformed={searchPerformed}
                  allowInteraction={inputActive}
                />

                {showTitle && <div style={threeDTitleStyle}>STAKE.CITY</div>}

                {showPrompt && (
                  <h1 style={promptStyle}>WHERE ARE YOU HEADED TO?</h1>
                )}

                <div style={inputContainerStyle}>
                  {!inputActive && <div style={startButtonStyle}>START</div>}
                  {inputActive && (
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      style={inputStyle}
                      autoFocus
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                  )}
                </div>
              </div>
            </div>
          }
        />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/light-paper" element={<LightPaper />} />
        <Route path="/white-paper" element={<WhitePaper />} />
        <Route path="/Documentation" element={<DocPage />} />
      </Routes>
    </div>
  );
};

const headerStyle = {
  position: "absolute",
  top: "10px",
  left: 0,
  right: 0,
  height: "100px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",
  backgroundColor: "transparent",
  zIndex: 30,
};

const buttonStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: "white",
  border: "none",
  borderRadius: "5px",
  padding: "10px 15px",
  cursor: "pointer",
  fontSize: "16px",
};

const mobileMenuButtonStyle = {
  backgroundColor: "transparent",
  border: "none",
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
};

const mobileMenuStyle = {
  position: "absolute",
  top: "100%",
  right: "20px",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  borderRadius: "5px",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const mobileLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px",
  padding: "5px 0",
};

const titleStyle = {
  position: "absolute",
  top: "120px",
  left: "50%",
  transform: "translateX(-50%)",
  color: "rgba(255, 255, 255, 1)",
  fontSize: "clamp(36px, 8vw, 72px)",
  fontWeight: "bold",
  fontFamily: "Arial",
  textAlign: "center",
  zIndex: 10,
  userSelect: "none",
  pointerEvents: "none",
  width: "100%",
  padding: "0 20px",
  boxSizing: "border-box",
};

const threeDTitleStyle = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%) translateZ(-500px) rotateX(30deg)",
  color: "rgba(255, 255, 255, 0.1)",
  fontSize: "clamp(72px, 16vw, 144px)",
  fontWeight: "bold",
  fontFamily: "Arial",
  textAlign: "center",
  zIndex: 1,
  userSelect: "none",
  pointerEvents: "none",
  width: "100%",
  padding: "0 20px",
  boxSizing: "border-box",
  perspective: "1000px",
};

const promptStyle = {
  position: "absolute",
  top: "120px",
  left: "50%",
  transform: "translateX(-50%)",
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "clamp(24px, 5vw, 48px)",
  fontFamily: "Arial",
  textAlign: "center",
  zIndex: 10,
  userSelect: "none",
  width: "100%",
  padding: "0 20px",
  boxSizing: "border-box",
};

const inputContainerStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
  zIndex: 10,
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "clamp(24px, 5vw, 48px)",
  fontFamily: "Arial",
  cursor: "pointer",
  userSelect: "none",
  pointerEvents: "none",
};

const startButtonStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%)",
  color: "rgba(255, 255, 255, 0.35)",
  fontSize: "clamp(24px, 5vw, 48px)",
  fontFamily: "Arial",
  cursor: "pointer",
};

const inputStyle = {
  position: "absolute",
  top: "85%",
  left: "50%",
  transform: "translate(-50%)",
  background: "transparent",
  border: "none",
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "clamp(24px, 5vw, 48px)",
  fontFamily: "Arial",
  textAlign: "center",
  outline: "none",
  width: "100%",
  caretColor: "rgba(255, 255, 255, 0.7)",
  fontWeight: "bold",
  padding: "0 20px",
  boxSizing: "border-box",
  pointerEvents: "all",
};

const landingContentStyle = {
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  padding: "50px 20px",
};

const sectionStyle = {
  maxWidth: "800px",
  margin: "0 auto 50px auto",
};

const sectionTitleStyle = {
  fontSize: "2.5rem",
  marginBottom: "20px",
  color: "#4a90e2",
};

const paragraphStyle = {
  fontSize: "1.1rem",
  lineHeight: "1.6",
  marginBottom: "20px",
};

const listStyle = {
  fontSize: "1.1rem",
  lineHeight: "1.6",
  marginBottom: "20px",
  paddingLeft: "20px",
};

const ctaButtonStyle = {
  backgroundColor: "#4a90e2",
  color: "#ffffff",
  border: "none",
  padding: "15px 30px",
  fontSize: "1.2rem",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

export default App;
