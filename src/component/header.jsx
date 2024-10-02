import { Link } from "react-router-dom";
import React from "react";
import mainlogo from '/mainLogo.png'
import '../css/header.css'

const Header = () => {
    return (
        <nav className="py-4 h-25 mx-6">
            <ul className="flex flex-row flex-wrap justify-between items-center">
                <div className="hover:cursor-pointer">
                    <img src={mainlogo} alt="Stake_city" className="w-20" />
                </div>

                <div className="flex space-x-6">
                    <Link to="/" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110  duration-300 hover:border-cyan-100 delay-20">Home</Link>
                    <Link to="/" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110  duration-300 hover:border-cyan-100 delay-20">Leaderboard</Link>
                    <Link to="/" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110  duration-300 hover:border-cyan-100 delay-20">User Dashboard</Link>
                    <Link to="/" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110  duration-300 hover:border-cyan-100 delay-20">About Us</Link>
                    <Link to="/" className="text-white transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:border-cyan-100 delay-20">Contact Us</Link>
                </div>
                
                <div className="flex space-x-2">
                    <button className="  rounded-3xl px-4 bg-emerald-400 py-2 shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out" >Sign Up</button>
                    <button className=" rounded-3xl px-4 bg-emerald-400 py-2 shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out" >Log In</button>
                </div>
            </ul>
        </nav>
    )
}

export default Header;