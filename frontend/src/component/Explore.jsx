import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MapBoxMap from './MapboxMap'
import DropTaskPopup from "./droptask";

const Explore = () => {
    
    const [center, setCenter] = useState(null);

    return (
        <div>
        <MapBoxMap
            showControls={false}
            />
        </div>
    );
};

export default Explore;