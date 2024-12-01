import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import mainlogo from '/mainLogo.png'
import '../component/styles//header.css'
import SignUpPopUp from "./popups/signUpPopUp";
import LogInPopUp from "./popups/logInPopUp";
import ForgetPasswordPopup from "./popups/forgetPasswordPopup";
import profilePic from '../images/profileIcon.png';
import { HiOutlineMenuAlt4, HiX } from "react-icons/hi";  // Importing icons for burger menu (open/close)

const Header = () => {
    const [signUpPopUp, setsSignUpPopUp] = useState(false);
    const [logInPopUp, setlogInPopUp] = useState(false);
    const [forgetPass, setforgetPass] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in

    // State to track if the mobile menu is open (for burger menu functionality)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("jwtToken");
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    // Function to toggle the burger menu (open/close)
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    const signUpPopUpOpen = () => {
        setsSignUpPopUp(true);
    };
    const onCloseSignUp = () => {
        setsSignUpPopUp(false);
    };

    const logInPopUpOpen = () => {
        setlogInPopUp(true);
    };

    const OnCloselogInPopUp = () => {
        setlogInPopUp(false);
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        OnCloselogInPopUp(); // Close the login popup
    };

    const AlreadyUserClick = () => {
        setlogInPopUp(true);
        setsSignUpPopUp(false);
    };

    const NewToGame = () => {
        setlogInPopUp(false);
        setsSignUpPopUp(true);
    };

    const forgetPassOpen = () => {
        setforgetPass(true);
        setlogInPopUp(false);
    };

    const forgetPassClose = () => {
        setforgetPass(false);
    };

    return (
        <>
            <nav className="py-4 mx-6 flex justify-between items-center">
                {/* <ul className="flex flex-row flex-wrap justify-between items-center"> */}
                    <div className="hover:cursor-pointer">
                        <img src={mainlogo} alt="Stake_city" className="w-20" />
                    </div>

                    {/* Burger menu button (shown only on mobile screens) */}
                    <div className="sm:hidden">
                        <button onClick={toggleMenu}> {/* Toggles the mobile menu */}
                            {/* Show 'X' icon when menu is open, otherwise show burger menu icon */}
                            {isMenuOpen ? <HiX className="text-white w-8 h-8" /> : <HiOutlineMenuAlt4 className="text-white w-8 h-8" />}
                        </button>
                    </div>

                    <div className="hidden sm:flex space-x-6">
                        <Link to="/" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:border-cyan-100 delay-20">Home</Link>
                        <Link to="/leaderboard" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:border-cyan-100 delay-20">Leaderboard</Link>
                        <Link to="/userdashboard" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:border-cyan-100 delay-20">User Dashboard</Link>
                        <Link to="/" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:border-cyan-100 delay-20">About Us</Link>
                        <Link to="/contactus" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:border-cyan-100 delay-20">Contact Us</Link>
                    </div>

                    <div className="hidden sm:flex space-x-2">
                        {isLoggedIn ? (
                            <Link to="/profile">
                                <img src={profilePic} alt="Profile" className="w-15 h-9 rounded-full" />
                            </Link>
                        ) : (
                            <>
                                <button onClick={signUpPopUpOpen} className="rounded-3xl px-4 bg-emerald-400 py-2 shadow-lg shadow-emerald-800 hover:bg-emerald-300">
                                    Sign Up
                                </button>
                                <button onClick={logInPopUpOpen} className="rounded-3xl px-4 bg-emerald-400 py-2 shadow-lg shadow-emerald-800 hover:bg-emerald-300">
                                    Log In
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu (only shown when the burger menu is open) */}
                    {isMenuOpen && (
                        <div className="sm:hidden absolute top-24 left-0 w-full text-white flex flex-col items-center space-y-4 py-4 z-50" style={{ backgroundColor: '#172435' }}>
                            {/* Navigation links for mobile with click feedback */}
                            <Link
                                to="/"
                                className="text-white px-4 py-2 rounded-md transition ease-in-out duration-200 active:bg-[#34D399] focus:bg-[#34D399]"
                                onClick={toggleMenu} // Close the menu after clicking the link
                            >
                                Home
                            </Link>
                            <Link
                                to="/"
                                className="text-white px-4 py-2 rounded-md transition ease-in-out duration-200 active:bg-[#34D399] focus:bg-[#34D399]"
                                onClick={toggleMenu}
                            >
                                Leaderboard
                            </Link>
                            <Link
                                to="/userdashboard"
                                className="text-white px-4 py-2 rounded-md transition ease-in-out duration-200 active:bg-[#34D399] focus:bg-[#34D399]"
                                onClick={toggleMenu}
                            >
                                User Dashboard
                            </Link>
                            <Link
                                to="/"
                                className="text-white px-4 py-2 rounded-md transition ease-in-out duration-200 active:bg-[#34D399] focus:bg-[#34D399]"
                                onClick={toggleMenu}
                            >
                                About Us
                            </Link>
                            <Link
                                to="/contactus"
                                className="text-white px-4 py-2 rounded-md transition ease-in-out duration-200 active:bg-[#34D399] focus:bg-[#34D399]"
                                onClick={toggleMenu}
                            >
                                Contact Us
                            </Link>
                            {/* If user is logged in, show profile icon */}
                            {isLoggedIn ? (
                                <Link to="/profile" className="text-white px-4 py-2 rounded-md transition ease-in-out duration-200 active:bg-[#34D399] focus:bg-[#34D399]" onClick={toggleMenu}>
                                    <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full" />
                                </Link>
                            ) : (
                                <>
                                    {/* Sign Up and Log In buttons for mobile view */}
                                    <button onClick={signUpPopUpOpen} className="rounded-3xl px-4 py-2 bg-emerald-400 shadow-lg shadow-emerald-800 active:bg-[#34D399] focus:bg-[#34D399] transition ease-in-out duration-200">
                                        Sign Up
                                    </button>
                                    <button onClick={logInPopUpOpen} className="rounded-3xl px-4 py-2 bg-emerald-400 shadow-lg shadow-emerald-800 active:bg-[#34D399] focus:bg-[#34D399] transition ease-in-out duration-200">
                                        Log In
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                {/* </ul> */}
            </nav>

            <SignUpPopUp signUpPopUpOpen={signUpPopUpOpen} onClose={onCloseSignUp} isOpen={signUpPopUp} AlreadyUserClick={AlreadyUserClick} onRegisterSuccess={logInPopUpOpen} />
            <LogInPopUp logInPopUpOpen={logInPopUpOpen} isOpen={logInPopUp} onClose={OnCloselogInPopUp} NewToGame={NewToGame} forgetPassOpen={forgetPassOpen} onLoginSuccess={handleLoginSuccess} />
            <ForgetPasswordPopup isOpen={forgetPass} onClose={forgetPassClose} />
        </>
    );
};

export default Header;
