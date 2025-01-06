import React, { useState, useRef, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/taskbar.css'; // External CSS for styles
import '../styles/searchbar.css'; // Import the CSS file

const Taskbar = ({ onSearch }) => {
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null); // Reference for input field

  const toggleSearchBar = () => {
    if (isSearchBarVisible) {
      if (searchQuery.trim() === "") {
        setIsSearchBarVisible(false);
      } else {
        handleSearchSubmit();
      }
    } else {
      setIsSearchBarVisible(true);
    }
  };

  useEffect(() => {
    if (isSearchBarVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchBarVisible]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSearch && searchQuery.trim() !== "") {
      onSearch(searchQuery);
      setSearchQuery("");
      setIsSearchBarVisible(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const navigate = useNavigate()
  return (
    <>
      <div className={`search-bar-container ${isSearchBarVisible ? 'search-bar-visible' : ''}`}>
        <input
          type="text"
          ref={inputRef}
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyPress}
          placeholder="[Enter Location Here]"
          className="search-bar-input"
        />
      </div>

      <div className="taskbar-container">
        <div className="taskbar">
          <button onClick={toggleSearchBar} className="taskbar-btn">
            <img src="/search-icon.svg" alt="Search" className="taskbar-icon tasks" />
          </button>

          <button className="taskbar-btn">
            <img src="/location-icon.png" alt="Chat" className="taskbar-icon messages" />
          </button>

          <button className="avatar-btn">
            <img src="/avatar.svg" alt="Avatar" className="avatar-icon" />
          </button>

          <button className="taskbar-btn" onClick={() => navigate('/leaderboard')} >
            <img src="/release-stake-icon.png" alt="Release-Stake" className="taskbar-icon release-stake" />
          </button>

          <button className="taskbar-btn">
            <img src="/settings-icon.png" alt="Settings" className="taskbar-icon settings" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Taskbar;
