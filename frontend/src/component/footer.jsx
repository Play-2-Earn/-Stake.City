import React from "react";
import { Link } from "react-router-dom";
import '../component/styles/header.css';
import mainLogo from '/mainLogo.png';

const Footer = () => {
    return (
        <footer className="mt-6 mb-6">
            {/* Logo and branding section */}
            <div className="flex flex-row items-center justify-center sm:justify-start opacity-30 hover:opacity-60 transition-opacity delay-100 cursor-pointer mb-6">
                <img src={mainLogo} alt="Stake_city" className="h-16 sm:h-24 mr-4" /> {/* Keep logo and text side by side */}
                <p className="text-3xl sm:text-5xl whitespace-nowrap">Stake.city</p> 
            </div>

            {/* Links section */}
            <div className="mx-6 grid grid-cols-3 gap-8 sm:flex sm:flex-row sm:justify-evenly sm:items-start text-center sm:text-left">
                <div className="mb-6 sm:mb-0">
                    <h5 className="border-b mb-3 font-semibold">Play</h5>
                    <ul>
                        <li><Link to="/">What is Stake City?</Link></li>
                        <li><Link to="/">Play on web</Link></li>
                        <li><Link to="/">Events</Link></li>
                        <li><Link to="/">Tutorial</Link></li>
                        <li><Link to="/">Explore map</Link></li>
                    </ul>
                </div>
                <div className="mb-6 sm:mb-0">
                    <h5 className="border-b mb-3 font-semibold">Economy</h5>
                    <ul>
                        <li><Link to="/">How it works?</Link></li>
                        <li><Link to="/">Whitepaper</Link></li>
                        <li><Link to="/">Tokenaiser</Link></li>
                    </ul>
                </div>
                <div className="mb-6 sm:mb-0">
                    <h5 className="border-b mb-3 font-semibold">Socials</h5>
                    <ul>
                        <li><Link to="/">X/Twitter</Link></li>
                        <li><Link to="/">Discord</Link></li>
                        <li><Link to="/">Telegram</Link></li>
                        <li><Link to="/">Facebook</Link></li>
                    </ul>
                </div>
                <div className="mb-6 sm:mb-0">
                    <h5 className="border-b mb-3 font-semibold">Support</h5>
                    <ul>
                        <li><Link to="/">Submit Request</Link></li>
                        <li><Link to="/">Submit Bug</Link></li>
                    </ul>
                </div>
                <div className="mb-6 sm:mb-0 ">
                    <h5 className="border-b mb-3 font-semibold">Legal</h5>
                    <ul>
                        <li><Link to="/">Terms and Condition</Link></li>
                        <li><Link to="/">Privacy and Policy</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;