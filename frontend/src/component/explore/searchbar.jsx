import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false); // State for search bar visibility
  const [searchQuery, setSearchQuery] = useState(""); // State to hold search input value

  const toggleSearchBar = () => {
    if (isSearchBarVisible) {
      // If the search bar is currently visible
      if (searchQuery.trim() === "") {
        // If the input is empty, hide the search bar
        setIsSearchBarVisible(false);
      } else {
        // Submit the search if there's input
        handleSearchSubmit();
      }
    } else {
      // Show the search bar
      setIsSearchBarVisible(true);
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e); // Call the submit function when Enter is pressed
    }
  };
  
  return (
    <div style={{ position: 'absolute', bottom: '2%', left: '50%', transform: 'translateX(-50%)', zIndex: 15, display: 'flex', alignItems: 'center' }}>
      {/* Search Input Box */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress} // Add this line to handle Enter key
        placeholder="[Enter Location Here]"
        style={{
          padding: '10px 15px',
          borderRadius: '25px',
          color: '#fff',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          border: '5px solid rgba(255, 255, 255, 0.5)',
          outline: 'none',
          marginRight: '10px',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          transform: isSearchBarVisible ? 'translateX(35px)' : 'translateX(100px)', // Moves left when hidden
          opacity: isSearchBarVisible ? 1 : 0,
          pointerEvents: isSearchBarVisible ? 'auto' : 'none',
          textAlign: 'center',
        }}
      />

      {/* Search Button */}
      <button
        onClick={toggleSearchBar}
        style={{
          backgroundColor: '#33669C',
          borderRadius: '36px',
          cursor: 'pointer',
          transition: 'transform 0.3s ease', // Animation for sliding effect
          transform: isSearchBarVisible ? 'translateX(5px)' : 'translateX(-115px)', // Button slides right when input is visible
        }}
      >
        <img
          src="/search-icon.svg" // Update with your search icon path
          alt="Search"
          style={{
            width: '60px', // Adjust icon size
            height: 'auto',
          }}
        />
      </button>
    </div>
  );
};

export default SearchBar;
