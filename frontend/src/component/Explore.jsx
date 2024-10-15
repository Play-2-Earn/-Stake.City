import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MapBoxMap from './MapboxMap'
import DropTaskPopup from "./droptask";
import Header from "./header";

const Explore = () => {
    const { q_id } = useParams(); 
    const [center, setCenter] = useState(null);

    useEffect(() => {
        if(!sessionStorage.getItem("jwtToken")){
            alert("Please login first");
            window.location.href = `/${q_id}`;
            return;
        }

        if (q_id) {
            console.log(`Received q_id: ${q_id}`);
            
        }
    }, [q_id]);
    return (
        <div>

            <Header />
        <MapBoxMap
            showControls={false}
            q_id={q_id}
            />
        </div>
    );
};

export default Explore;