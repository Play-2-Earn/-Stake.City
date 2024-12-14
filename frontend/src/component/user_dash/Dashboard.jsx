import classNames from 'classnames';
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import DashboardGrid from './DashboardGrid';
import Header from '../header';
import Footer from '../footer';

const UserDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutSide = () => {
        if (sidebarRef.current) {
            setIsSidebarOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutSide);

        return () => {
            document.addEventListener('mousedown', handleClickOutSide);
        }
    }, [])


    return (
        <>
            {/* <Header /> */}
            <div className="bg-neutral-100 h-screen w-screen flex">
                {/* Main content */}
                <div className={classNames("flex flex-col flex-1 transition-all duration-300", {
                    "mr-0 md:mr-60": isSidebarOpen, // Adjust margin based on sidebar state
                })}>
                    {/* Header */}
                    <DashboardHeader toggleSidebar={toggleSidebar} />

                    {/* Grid content */}
                    <div className="flex-1 min-h-0 overflow-auto">
                        <DashboardGrid />
                    </div>
                </div>

                {/* Sidebar */}
                <div ref={sidebarRef}>
                    <Sidebar
                        isSidebarOpen={isSidebarOpen}
                        className={`absolute right-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    />
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
}


export default UserDashboard;