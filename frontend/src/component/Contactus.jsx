import React from "react";
import graphic2 from '/graphic_2.svg'
import discord from '/discord-icon.svg'
import twitter from '/x_icon_c.svg'
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";
import Header from "./header";
import Footer from "./footer";

const ContactUs = () => {
    return (
        <>
            <Header />
            <div className="bg-space bg-scroll bg-no-repeat min-h-screen py-12 flex justify-items-center">
                <div className="flex flex-col md:flex-row px-5 gap-8 w-full">
                    {/* Contact Form section: */}
                    <div className="flex-1">
                        <h1 className="text-[#F0F3F5] text-5xl md:text-7xl font-semibold mb-7">Contact Us</h1>
                        <form action="POST" className="bg-gradient-to-r from-[#0d1b2a]/80 to-[#20c999]/80 rounded-lg border-4 border-[#f0f3f5] p-6 space-y-4">
                            <input type="text" className="h-10 w-full text-[#F0F3F5] placeholder-gray-400 shadow-sm bg-[#0D1B2A] text-lg font-normal rounded-lg border border-[#A0AAB2] focus:outline-none pl-4" placeholder="Name" />
                            <input type="text" className="h-10 w-full text-[#F0F3F5] placeholder-gray-400 shadow-sm bg-[#0D1B2A] text-lg font-normal rounded-lg border border-[#A0AAB2] focus:outline-none pl-4" placeholder="Username" />
                            <input type="text" className="h-10 w-full text-[#F0F3F5] placeholder-gray-400 shadow-sm bg-[#0D1B2A] text-lg font-normal rounded-lg border border-[#A0AAB2] focus:outline-none pl-4" placeholder="Email" />
                            <textarea rows={4} className="w-full text-[#F0F3F5] placeholder-gray-400 bg-[#0D1B2A] text-lg shadow-sm font-normal rounded-lg border border-[#A0AAB2] focus:outline-none p-4" placeholder="Message" />
                            <button className="h-12 w-full text-white text-base font-semibold rounded-full transition-all duration-700 bg-[#20C997]">Send</button>
                        </form>
                    </div>

                    {/* Info section: */}
                    <div className="flex flex-1 flex-col items-center space-y-6">
                        <img src={graphic2} alt="graphic" className="w-40 md:w-80 h-auto" />
                        <div className="bg-gradient-to-r from-[#0d1b2a]/80 to-[#20c999]/80 rounded-lg border-4 border-[#f0f3f5] w-full p-6 space-y-4">
                            <div id="contact" className="space-y-3">
                                <div className="flex">
                                    <HiLocationMarker className="w-6 h-6 text-[#F0F3F5] mx-1" />
                                    <p className="text-[#F0F3F5]">London, England</p>
                                </div>
                                <div className="flex">
                                    <HiMail className="w-6 h-6 text-[#F0F3F5] mx-1" />
                                    <p className="text-[#F0F3F5]">stake.city@gmail.com</p>
                                </div>
                                <div className="flex">
                                    <HiPhone className="w-6 h-6 text-[#F0F3F5] mx-1" />
                                    <p className="text-[#F0F3F5]">+123 456789999</p>
                                </div>
                            </div>
                            <div id="socials" className="flex justify-evenly m-2">
                                <a href="http://discord.org"><img src={discord} alt="" className="w-10 h-10" /></a>
                                <a href="http://x.com"><img src={twitter} alt="" className="w-10 h-10" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ContactUs;
