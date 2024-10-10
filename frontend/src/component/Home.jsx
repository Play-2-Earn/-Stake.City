import React from "react";
import '../component/styles/home.css'
import { Link } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import Globe from "./Globe";

const Home = () => {
    return (
        <>
            <Header />
            <div className="glob_area flex justify-center align-middle flex-wrap">
                <Globe />
                <div className="">
                    <h1 className="glob_text drop-shadow-xl">Are you ready to explore?</h1>
                    <Link to="/explore" className=" glob_start_btn rounded-3xl px-4 bg-emerald-400 py-2 shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out" >Start Game </Link>
                </div>
            </div>
            <div className="second_ele bg-transparent">
                <div className="flex justify-end flex-col mr-10">
                    <h1 className="text-right">Follow Us on Socials</h1>
                    <p className="mt-2 text-right text-wrap custom-paragraph">
                        Stay connected and never miss an update! Follow us on our social media channels
                        for the latest news, exclusive content, and behind-the-scenes sneak peeks. Join
                        the conversation and be part of our community!
                    </p>
                </div>

                <div className="flex justify-end mr-14 mt-4">
                    <button className="rounded-3xl mr-4 px-4 bg-emerald-400 py-2 shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out" >Whitepaper</button>
                    <button className="rounded-3xl px-4 bg-emerald-400 py-2 shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out" >FAQ's</button>
                </div>
            </div>

            <div className="third_element">
                <div className="flex justify-end flex-col mr-10 px-10">
                    <h1 className="mt-8 text-right px-14 text-6xl"><span className="mr-20">EXPLORE</span><br /><span className="">COMPLETE</span><br /><span className="earn">EARN.</span></h1>
                    <p className="mt-6 text-right text-wrap custom-paragraph_sec">
                        Stake City is an interactive, immersive platform that blends gaming with exploration. Users can search for cities on a 3D Earth model, target landmarks, and ask questions related to specific locations. Other users respond to these questions, and the best answer, selected by the inquirer, earns rewards. This collaborative experience fosters community engagement, learning, and fun, combining elements of discovery and competition. Stake City stands out by turning global exploration into a rewarding game, making it both educational and entertaining.
                    </p>
                </div>
            </div>

            {/* <div className="chain_1">
                <img src={chain_1} alt="chain1_img" className="chain1-image" />
            </div> */}
            <div className="last_element">
                <div className="flex mt-20 flex-col">
                    <h1 className="text-6xl text-center">Connect To Keep <br /> Building With Us.</h1>
                    <p className="text-center mt-8">Enter your email to subscribe to our newsletter and receive updates directly from us</p>
                    <input type="text" placeholder="Email address" className="mt-10 h-10 w-80 mx-auto px-3 rounded-xl" />
                    <Link to="/explore" className=" w-40 mx-auto rounded-3xl mt-9 px-4 bg-emerald-400 py-2 shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out" >Submit</Link>

                </div>
            </div>


            <Footer />

        </>
    )
}

export default Home;