import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false); // State for search bar visibility
  const [searchQuery, setSearchQuery] = useState(""); // State to hold search input value
  const GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const toggleSearchBar = () => {
    if (searchQuery.trim() === "") {
      // If input is empty, just toggle visibility (close the search bar)
      setIsSearchBarVisible((prevVisible) => !prevVisible);
    } else {
      // If there is input, act as "Go" and submit the search
      handleSearchSubmit();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search input value
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault(); // Prevent form submission reload if coming from form

    if (onSearch && searchQuery.trim() !== "") {
      onSearch(searchQuery); // Call the onSearch function from parent with the search query
      setSearchQuery(""); // Clear the input after search
      setIsSearchBarVisible(false); // Optionally close the search bar after search is submitted
    }
  };

  return (
    <div>
      {/* Search Button */}
      <button
        onClick={toggleSearchBar}
        style={{
          position: 'absolute',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          zIndex: 15, // Ensure button is above the map
          padding: '10px 20px',
          backgroundColor: '#1d72b8',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Search
      </button>

      {/* Search Bar */}
      {isSearchBarVisible && (
        <div
          style={{
            position: 'absolute',
            top: '50.5%',
            right: '80px',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            padding: '10px 27px',
            borderRadius: '5px',
          }}
        >
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for a location"
              style={{
                padding: '8px',
                borderRadius: '3px',
                border: '1px solid #ccc',
                marginBottom: '10px',
                width: '200px',
              }}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
