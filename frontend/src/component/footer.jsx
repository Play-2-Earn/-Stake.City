import React from "react";
import { Link } from "react-router-dom";
import '../css/header.css'
import mainLogo from '/mainLogo.png'

const Footer = () => {
    return (
        <footer className="mt-6 mb-6">
            <div className="flex flex-row flex-wrap align-middle justify-start opacity-30 hover:opacity-60 transition-opacity delay-100 cursor-pointer">
                <img src={mainLogo} alt="Stake_city" className=" h-24 " />
                <p className="my-auto text-5xl">Stake.city</p>
            </div>

            <div className=" mx-6 flex flex-row flex-wrap justify-evenly align-middle">
                <div>
                    <h5 className="border-b mb-3 font-semibold ">Play</h5>
                    <ul>
                        <li><Link>What is Stake City?</Link></li>
                        <li><Link>Play on web</Link></li>
                        <li><Link>Events</Link></li>
                        <li><Link>Tutorial</Link></li>
                        <li><Link>Explore map</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="border-b mb-3 font-semibold ">Economy</h5>
                    <ul>
                        <li><Link>How it work?</Link></li>
                        <li><Link>Whitepaper</Link></li>
                        <li><Link>Tokenaiser</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="border-b mb-3 font-semibold ">Socials</h5>
                    <ul>
                        <li><Link>X/Twitter</Link></li>
                        <li><Link>Discord</Link></li>
                        <li><Link>Telegram</Link></li>
                        <li><Link>Facebook</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="border-b mb-3 font-semibold ">Support</h5>
                    <ul>
                        <li><Link>Submit Request</Link></li>
                        <li><Link>Submit Bug</Link></li>
                    </ul>

                </div>
                <div>
                    <h5 className="border-b mb-3 font-semibold ">Legal</h5>
                    <ul>
                        <li><Link>Terms and Condition</Link></li>
                        <li><Link>Privacy and Policy</Link></li>
                    </ul>
                </div>
            </div>

        </footer>
    )
}

export default Footer;