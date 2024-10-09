import React, { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DropTaskPopup from "./droptask";
import GamifiedTaskPopup from "./starttask";

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../css/mapboxmap.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapboxMap = ({ position, searchPerformed, showControls }) => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [activePopup, setActivePopup] = useState(null); // Track the active popup
  const [dropTaskSuccess, setDropTaskSuccess] = useState(false);
  const [taskCoordinates, setTaskCoordinates] = useState(null);  // Store the coordinates for the task drop
  const [taskMarkers, setTaskMarkers] = useState([]); // Array to store task markers and data
  const [selectedTask, setSelectedTask] = useState(null); // Store the selected task data

  const sampleTask = {
    title: "Magical Park Cleanup Quest",
    description:
      "Embark on an enchanted journey to restore the beauty of Central Park! Will you answer the call of this epic quest?",
    location: "Central Park, New York",
    stakeAmount: 1000,
  };

  const sampleUser = {
    name: "Eco Warrior Alice",
    id: "hero123",
    level: 42,
    avatar: "/api/placeholder/100/100",
  };

  const handleMarkerClick = (task) => {
    setIsPopupOpen(true);  // Open the StartTask popup
    setSelectedTask(task);  // Store the clicked task data
    setActivePopup("GamifiedTaskPopup"); // Set the active popup to GamifiedTaskPopup
  };

  const handleDropQuestClick = (coordinates) => {
    setIsPopupOpen(true);
    setActivePopup("DropTaskPopup"); // Set the active popup to GamifiedTaskPopup
    setTaskCoordinates(coordinates);  // Store the coordinates where the popup was triggered
  };

  const handleDropTaskSuccess = (wasSuccessful) => {
    setDropTaskSuccess(wasSuccessful);
    setIsPopupOpen(false); // Close the popup

    if (wasSuccessful) {

      if (taskCoordinates && mapRef.current) {
        // Create a new marker at the stored coordinates
        const marker = new mapboxgl.Marker()
          .setLngLat(taskCoordinates)
          .addTo(mapRef.current);

        // Store the marker with task data in the taskMarkers array
        setTaskMarkers(prevMarkers => [
          ...prevMarkers,
          {
            marker,
            task: {
              title: "Magical Park Cleanup Quest", // Example task data (use real data here)
              description: "Embark on an enchanted journey...",
              location: "Central Park, New York",
            }
          }
        ]);

        // Add click event to the marker to open the StartTask popup
        marker.getElement().addEventListener('click', () => {
          handleMarkerClick({
            title: "Magical Park Cleanup Quest", // Example task data (use real data)
            description: "Embark on an enchanted journey...",
            location: "Central Park, New York",
          });
        });
      }

      setTaskCoordinates(null);

      setTimeout(() => {
        setIsPopupOpen(false); // Close the popup after feedback
        setFeedbackMessage(""); // Clear the feedback after popup closes
      }, 2000);
    } else {
      setIsPopupOpen(false);
    }
  };

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const navigationControlRef = useRef(null);

  const MIN_ZOOM = 1; // Minimum zoom level
  const MAX_ZOOM = 20; // Maximum zoom level
  const secondsPerRevolution = 240; // Speed of spinning
  let spinEnabled = true;
  let mouseHoldTimeout = null;  // Added to track the timeout for mouse hold
  let isMouseHeld = false;      // Added to track if the mouse is currently being held


  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/play2earn/cm1tnpmnd014d01pi7httawcp',
        projection: 'globe',
        zoom: searchPerformed ? 7 : 1,
        center: position || [0, 0],
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        scrollZoom: false, // Disable scroll zoom initially
        keyboard: false, // Disable keyboard controls initially
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
        spinEnabled = false; // Stop spinning on user interaction
      });
      map.on('dragend', () => {
        userInteracting = false;
        map.scrollZoom.enable(); // Enable scroll zoom after user drags
      });

      map.on('rotate', () => {
        map.scrollZoom.enable(); // Enable zooming after the first rotation
        map.keyboard.enable(); // Enable keyboard controls
        spinEnabled = false; // Stop spinning after rotation
      });

      // Mouse hold to create a task
      map.on('mousedown', (e) => {
        isMouseHeld = true;
        var coordinates;
        // Trigger a long press after 500ms
        mouseHoldTimeout = setTimeout(() => {
          if (isMouseHeld) {
            // Get coordinates where mouse is held
            const coordinates = e.lngLat
            // popup feature of mapbox.gl can be later removed and instead have a custom popup component implemented
            handleDropQuestClick(coordinates);
          }
        }, 1000); // 500ms to trigger the pin creation (adjust as needed)
      });

      // Detect when the mouse is released, so it doesn't trigger after a short click
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
    if (searchPerformed && position && mapRef.current) {
      mapRef.current.flyTo({
        center: position,
        zoom: 10,
        speed: 1.5,
        curve: 1.2,
        easing: (t) => t,
        essential: true
      });

      // Enable zooming after a search is performed
      if (mapRef.current) {
        mapRef.current.scrollZoom.enable();
        mapRef.current.keyboard.enable();
        spinEnabled = false; // Stop spinning after search
      }
    }
  }, [position, searchPerformed]);

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
        } else if (event.key === '+' || event.key === '=' || event.key === 'NumpadAdd') { // Handle zoom in with '+'
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
      <GamifiedTaskPopup // StartTask popup component
        task={sampleTask}
        user={sampleUser}
        isStaker={Math.random() > 0.5}
        isOpen={isPopupOpen && activePopup === "GamifiedTaskPopup"} // Conditional rendering based on activePopup
        onClose={() => setIsPopupOpen(false)} // Close the popup
      />
      <DropTaskPopup // DropTask popup component
        isOpen={isPopupOpen && activePopup === "DropTaskPopup"} // Conditional rendering based on activePopup
        onClose={() => setIsPopupOpen(false)}
        onSuccess={handleDropTaskSuccess} // Callback function for task drop success
      />
      <div // Map container
        id="map-container"
        ref={mapContainer}
        style={{ width: '100%', height: '100vh', outline: 'none' }} // Remove outline
        tabIndex="0" // Make the div focusable for keyboard controls
      />
    </div>
  );
};

export default MapboxMap;
