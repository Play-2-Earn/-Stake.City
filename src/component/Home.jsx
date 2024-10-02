import React from "react";
import '../css/home.css'
import Header from "./header";
import Footer from "./footer";
import Globe from "./globe";

const Home = () => {

    return (
        <>
            <Header />
            <div className="glob_area flex justify-center align-middle flex-wrap">
                <Globe />
                <div className="">
                    <h1 className="glob_text drop-shadow-xl">Are you ready to explore?</h1>
                    <button className=" glob_start_btn rounded-3xl px-4 bg-emerald-400 py-2 shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out" >Start Game</button>
                </div>
            </div>
            <Footer />

        </>
    )
}

export default Home;