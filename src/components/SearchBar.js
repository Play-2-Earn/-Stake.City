import React, { useState } from 'react';
import axios from 'axios';

const GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const SearchBar = ({ onSearch, style}) => {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${GEOCODING_URL}${encodeURIComponent(query)}.json`, {
        params: {
          access_token: ACCESS_TOKEN
        }
      });
      const { center } = response.data.features[0];
      onSearch(center); // center is [longitude, latitude]
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  return (
    <div style={style} className="flex items-center">
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search for a place" 
        className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        onClick={handleSearch} 
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
