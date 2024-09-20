import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapboxMap = ({ position, searchPerformed, showControls }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null); // Ref to store the map instance
  const [userInteracting, setUserInteracting] = useState(false); // Track user interaction
  const spinEnabled = useRef(true); // Use a ref to track spinning state

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/robinrai1349/cm1apho4200fz01pc323f11og',
        projection: 'globe',
        zoom: searchPerformed ? 7 : 1, // Initial zoom level
        center: position || [0, 0], // Initial position, default to [0, 0]
      });

      mapRef.current = map; // Store the map instance in the ref

      // Add zoom and rotation controls only when showControls is true
      if (showControls) {
        map.addControl(new mapboxgl.NavigationControl());
      }

      // Spin the globe when no search is performed
      const secondsPerRevolution = 240;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;

      function spinGlobe() {
        const zoom = map.getZoom();
        if (spinEnabled.current && !userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
          const center = map.getCenter();
          center.lng -= distancePerSecond;
          map.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      map.on('mousedown', () => setUserInteracting(true));
      map.on('dragstart', () => setUserInteracting(true));
      map.on('moveend', () => {
        if (!searchPerformed) spinGlobe();
      });

      spinGlobe();

      return () => map.remove();
    }
  }, [showControls]);

  // Fly to the searched location smoothly without interruption
  useEffect(() => {
    if (searchPerformed && position && mapRef.current) {
      const map = mapRef.current;

      // Temporarily disable user interaction during fly-to animation
      map.boxZoom.disable();
      map.scrollZoom.disable();
      map.dragPan.disable();
      map.dragRotate.disable();
      map.keyboard.disable();
      map.doubleClickZoom.disable();
      map.touchZoomRotate.disable();

      map.flyTo({
        center: position, // The [longitude, latitude] of the location
        zoom: 10,         // Target zoom level
        speed: 1.5,       // Fly speed (1 is default, higher is faster)
        curve: 1.2,       // How the animation should progress (1 is linear)
        easing: (t) => t, // Easing function (can be customized)
        essential: true,  // This animation is essential, so the user cannot stop it
      });

      // Re-enable interaction after the fly-to animation completes
      map.once('moveend', () => {
        map.boxZoom.enable();
        map.scrollZoom.enable();
        map.dragPan.enable();
        map.dragRotate.enable();
        map.keyboard.enable();
        map.doubleClickZoom.enable();
        map.touchZoomRotate.enable();
        setUserInteracting(false); // Allow interaction again
        spinEnabled.current = false; // Disable spinning after the first search
      });
    }
  }, [position, searchPerformed]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default MapboxMap;
