import classNames from "classnames";
import React from "react";
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from "./navigation_links";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import logo from "/logo7.svg"

const linkClasses = 'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base'

export default function Sidebar({ isSidebarOpen }) {
    return (
        <div
            className={classNames(
                "bg-[#0D1B2A] w-60 p-3 flex flex-col text-white fixed top-0 right-0 h-full transition-transform duration-300 z-40",
                {
                    "translate-x-full": !isSidebarOpen, // Hidden
                    "translate-x-0": isSidebarOpen, // Shown
                }
            )}
        >
            {/* Sidebar content */}
            <div className="flex items-center gap-2 px-1 py-3">
                <img src={logo} alt="" className="w-12 h-12" />
                <span className="text-neutral-100 text-lg">Stake.City</span>
            </div>
            <div className="flex-1 py-8 flex flex-col gap-0.5">
                {DASHBOARD_SIDEBAR_LINKS.map((item) => (
                    <SidebarLink key={item.key} item={item} />
                ))}
            </div>
            <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
                {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
                    <SidebarLink key={item.key} item={item} />
                ))}
                <div
                    className={classNames("text-red-500", linkClasses)}
                    onClick={() => {
                        sessionStorage.removeItem("jwtToken");
                        window.location.href = "/";
                    }}
                >
                    <span className="text-xl"><HiOutlineLogout /></span>
                    Logout
                </div>
            </div>
        </div>
    );
}

function SidebarLink({ item }) {
    const { pathname } = useLocation();

    return (
        <Link to={item.path} className={classNames(pathname === item.path ? 'bg-neutral-700 text-white' : 'text-neutral-400', linkClasses)}>
            <span className="text-xl">{item.icon}</span>
            {item.label}
        </Link>
    );
}
