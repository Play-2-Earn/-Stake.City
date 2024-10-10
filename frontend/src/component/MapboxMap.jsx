import React, { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DropTaskPopup from "./droptask";
import GamifiedTaskPopup from "./starttask";
import SearchBar from "./searchbar";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/mapboxmap.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapboxMap = ({ showControls }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [activePopup, setActivePopup] = useState(null);
  const [dropTaskSuccess, setDropTaskSuccess] = useState(false);
  const [taskCoordinates, setTaskCoordinates] = useState(null);
  const [taskMarkers, setTaskMarkers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [center, setCenter] = useState([0, 0]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [query, setQuery] = useState("");

  const sampleTask = {
    title: "Magical Park Cleanup Quest",
    description: "Embark on an enchanted journey to restore the beauty of Central Park! Will you answer the call of this epic quest?",
    location: "Central Park, New York",
    stakeAmount: 1000,
  };

  const sampleUser = {
    name: "Eco Warrior Alice",
    id: "hero123",
    level: 42,
    avatar: "/api/placeholder/100/100",
  };

  // UI button handling functions

  const handleSearch = async (newQuery) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(newQuery)}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const { center, place_name } = data.features[0];
      setCenter(center);
      setSearchPerformed(true);
      setQuery(place_name);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  // Popup handling functions

  const handleMarkerClick = (task) => {
    setSelectedTask(task);
    setActivePopup("GamifiedTaskPopup");
    setIsPopupOpen(true);
  };

  const handleDropQuestClick = (coordinates) => {
    setActivePopup("DropTaskPopup");
    setIsPopupOpen(true);
    setTaskCoordinates(coordinates);
  };

  useEffect(() => {
    console.log("Popup state changed:", isPopupOpen);
  }, [isPopupOpen]);

  useEffect(() => {
      if (activePopup === "GamifiedTaskPopup") {
          console.log("GamifiedTaskPopup opened with task:", selectedTask);
      }
      if (activePopup === "DropTaskPopup") {
        console.log("DropTaskPopup opened");
    }
  }, [activePopup, selectedTask]);

  const handleDropTaskSuccess = (wasSuccessful) => {
    setDropTaskSuccess(wasSuccessful);
    setIsPopupOpen(false);

    if (wasSuccessful) {
      if (taskCoordinates && mapRef.current) {
        const marker = createMarker(taskCoordinates); // Create the marker

        setTaskMarkers(prevMarkers => [
          ...prevMarkers,
          {
            marker,
            task: {
              title: "Magical Park Cleanup Quest",
              description: "Embark on an enchanted journey...",
              location: "Central Park, New York",
            }
          }
        ]);

        setTaskCoordinates(null);
      }
    } else {
      setIsPopupOpen(false);
    }
  };

  const createMarker = (coordinates) => {
    const marker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(mapRef.current);

    // Disable map interaction when hovering over the marker
    marker.getElement().addEventListener('mouseenter', () => {
      mapRef.current.scrollZoom.disable();
      mapRef.current.dragPan.disable();
    });

    // Re-enable map interaction when not hovering
    marker.getElement().addEventListener('mouseleave', () => {
      mapRef.current.scrollZoom.enable();
      mapRef.current.dragPan.enable();
    });

    // Handle marker click to show the task popup
    marker.getElement().addEventListener('click', () => {
      handleMarkerClick({
        title: "Magical Park Cleanup Quest",
        description: "Embark on an enchanted journey...",
        location: "Central Park, New York",
      });
    });

    return marker;
  };

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const navigationControlRef = useRef(null);

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 20;
  const secondsPerRevolution = 240;
  let spinEnabled = true;
  let mouseHoldTimeout = null;
  let isMouseHeld = false;

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/play2earn/cm1tnpmnd014d01pi7httawcp',
        projection: 'globe',
        zoom: 1,
        center: [0, 0],
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        scrollZoom: false,
        keyboard: false,
      });

      mapRef.current = map;

      let userInteracting = false;

      const spinGlobe = () => {
        if (spinEnabled && !userInteracting) {
          const distancePerSecond = 360 / secondsPerRevolution;
          const center = map.getCenter();
          center.lng -= distancePerSecond;
          map.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      };

      const spinInterval = setInterval(spinGlobe, 1000);

      map.on('mousedown', () => {
        userInteracting = true;
        spinEnabled = false;
      });

      map.on('dragend', () => {
        userInteracting = false;
        map.scrollZoom.enable();
      });

      map.on('rotate', () => {
        map.scrollZoom.enable();
        map.keyboard.enable();
        spinEnabled = false;
      });

      // Mouse hold to create a task
      map.on('mousedown', (e) => {
        isMouseHeld = true;
        mouseHoldTimeout = setTimeout(() => {
          if (isMouseHeld) {
            handleDropQuestClick(e.lngLat);
          }
        }, 1000);
      });

      map.on('mouseup', () => {
        clearTimeout(mouseHoldTimeout);
        isMouseHeld = false;
      });

      return () => {
        clearInterval(spinInterval);
        map.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (searchPerformed && center && mapRef.current) {
      mapRef.current.flyTo({
        center,
        zoom: 10,
        speed: 1.5,
        curve: 1.2,
        easing: (t) => t,
        essential: true,
      });
    }
  }, [center, searchPerformed]);

  useEffect(() => {
    if (mapRef.current) {
      if (navigationControlRef.current) {
        mapRef.current.removeControl(navigationControlRef.current);
      }

      if (showControls) {
        const navigationControl = new mapboxgl.NavigationControl();
        mapRef.current.addControl(navigationControl);
        navigationControlRef.current = navigationControl;
      }
    }
  }, [showControls]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (mapRef.current) {
        if (event.key === '-') {
          mapRef.current.zoomOut();
        } else if (event.key === '+' || event.key === '=' || event.key === 'NumpadAdd') {
          mapRef.current.zoomIn();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <GamifiedTaskPopup
        task={sampleTask}
        user={sampleUser}
        isStaker={Math.random() > 0.5}
        isOpen={isPopupOpen && activePopup === "GamifiedTaskPopup"}
        onClose={() => setIsPopupOpen(false) && setActivePopup(null)}
      />
      <DropTaskPopup
        isOpen={isPopupOpen && activePopup === "DropTaskPopup"}
        onClose={() => setIsPopupOpen(false) && setActivePopup(null) }
        onSuccess={handleDropTaskSuccess}
      />
      <div
        id="map-container"
        ref={mapContainer}
        style={{ width: '100%', height: '100vh', outline: 'none' }}
        tabIndex="0"
      />
    </div>
  );
};

export default MapboxMap;
