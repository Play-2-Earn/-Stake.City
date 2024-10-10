import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import mainlogo from '/mainLogo.png'
import '../component/styles//header.css'
import SignUpPopUp from "./popups/signUpPopUp";
import LogInPopUp from "./popups/logInPopUp";
import ForgetPasswordPopup from "./popups/forgetPasswordPopup";
import profilePic from '../images/profileIcon.png';

const Header = () => {
    const [signUpPopUp, setsSignUpPopUp] = useState(false);
    const [logInPopUp, setlogInPopUp] = useState(false);
    const [forgetPass, setforgetPass] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in

    useEffect(() => {
        const token = sessionStorage.getItem("jwtToken");
            if (token) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
    }, []);
    
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
            <nav className="py-4 h-25 mx-6">
                <ul className="flex flex-row flex-wrap justify-between items-center">
                    <div className="hover:cursor-pointer">
                        <img src={mainlogo} alt="Stake_city" className="w-20" />
                    </div>

                    <div className="flex space-x-6">
                        <Link to="/" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:border-cyan-100 delay-20">Home</Link>
                        <Link to="/" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:border-cyan-100 delay-20">Leaderboard</Link>
                        <Link to="/userdashboard" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:border-cyan-100 delay-20">User Dashboard</Link>
                        <Link to="/" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:border-cyan-100 delay-20">About Us</Link>
                        <Link to="/" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:border-cyan-100 delay-20">Contact Us</Link>
                    </div>

                    <div className="flex space-x-2">
                        {isLoggedIn ? (
                            <Link to="/profile">
                            <img src={profilePic} alt="Profile" className="w-15 h-9 rounded-full" />
                        </Link>
                        ) : (
                            <>
                                <button onClick={signUpPopUpOpen} className="rounded-3xl px-4 bg-emerald-400 py-2 shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out">
                                    Sign Up
                                </button>
                                <button onClick={logInPopUpOpen} className="rounded-3xl px-4 bg-emerald-400 py-2 shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out">
                                    Log In
                                </button>
                            </>
                        )}
                    </div>
                </ul>
            </nav>

            <SignUpPopUp signUpPopUpOpen={signUpPopUpOpen} onClose={onCloseSignUp} isOpen={signUpPopUp} AlreadyUserClick={AlreadyUserClick} onRegisterSuccess={logInPopUpOpen}/>
            <LogInPopUp logInPopUpOpen={logInPopUpOpen} isOpen={logInPopUp} onClose={OnCloselogInPopUp} NewToGame={NewToGame} forgetPassOpen={forgetPassOpen} onLoginSuccess={handleLoginSuccess}  />
            <ForgetPasswordPopup isOpen={forgetPass} onClose={forgetPassClose} />
        </>
    );
};

export default Header;
