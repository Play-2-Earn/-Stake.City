import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getFresnelMat } from '../helpers/getFresnelMat'; // Assuming this file is still located here
import './styles/globe.css';

const Globe = () => {
  const globeRef = useRef();
  const prevScrollY = useRef(0); // To track the previous scroll position
  const scrollSpeedFactor = 0.0005; // Adjust the speed of the globe's rotation
  let frameId; // For canceling the animation frame

  useEffect(() => {
    // Get the container for the globe
    const container = globeRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Set up the Three.js renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // Set up the camera
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.z = 2;

    // Set up the scene
    const scene = new THREE.Scene();

    // Earth setup
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;
    scene.add(earthGroup);

    const detail = 6; // Reduced detail level for performance
    const loader = new THREE.TextureLoader();
    const geo = new THREE.IcosahedronGeometry(1.0, detail);

    // Earth material
    const mat = new THREE.MeshStandardMaterial({
      map: loader.load("/assets/8k_earth_daymap.jpg"),
    });
    const earthMesh = new THREE.Mesh(geo, mat);
    earthGroup.add(earthMesh);

    // Night lights material
    const lightsMat = new THREE.MeshBasicMaterial({
      map: loader.load("/assets/8k_earth_nightmap.jpg"),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const lightsMesh = new THREE.Mesh(geo, lightsMat);
    earthGroup.add(lightsMesh);

    // Clouds material
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: loader.load("/assets/8k_earth_clouds.jpg"),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const cloudsMesh = new THREE.Mesh(geo, cloudsMat);
    cloudsMesh.scale.setScalar(1.003);
    earthGroup.add(cloudsMesh);

    // Fresnel glow
    const fresnelMat = getFresnelMat();
    const glowMesh = new THREE.Mesh(geo, fresnelMat);
    glowMesh.scale.setScalar(1.005);
    earthGroup.add(glowMesh);

    // Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff);
    sunLight.position.set(-2, 0.5, 1.5);
    scene.add(sunLight);

    // Throttle scroll handling
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) return;

      scrollTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY;

        // Determine scroll direction and apply rotation accordingly
        const scrollDelta = currentScrollY - prevScrollY.current;
        earthMesh.rotation.y += scrollDelta * scrollSpeedFactor;
        lightsMesh.rotation.y += scrollDelta * scrollSpeedFactor;
        cloudsMesh.rotation.y += scrollDelta * scrollSpeedFactor;

        // Update the previous scroll position
        prevScrollY.current = currentScrollY;

        scrollTimeout = null;
      }, 100); // Throttle scroll event by 100ms
    };

    // Animation loop
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      earthMesh.rotation.y += 0.0001;
      lightsMesh.rotation.y += 0.0001;
      cloudsMesh.rotation.y += 0.00015; // Reduce cloud rotation slightly for better performance
      glowMesh.rotation.y += 0.0001;

      renderer.render(scene, camera);
    };
    animate();

    // Handle resizing
    const handleResize = () => {
      const newWidth = container.offsetWidth;
      const newHeight = container.offsetHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frameId); // Stop animation on unmount
      container.removeChild(renderer.domElement); // Clean up renderer
    };
  }, []);

  return <div id="globe-container" ref={globeRef} />;
};

export default Globe;
