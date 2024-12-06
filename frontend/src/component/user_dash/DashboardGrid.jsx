import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLockedAmount, setWalletAddress, setWalletBalance } from "../../Store/Slices/Wallet";
import { Lock, Award, History, Coins, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import RedeemPointPopUp from "../popups/redeemPointPopUp";
import AddWalletNote from "../popups/addWalletNote";
import AddWalletPopUp from '../popups/addWalletPopUp';
import { setPointsBalance } from "../../Store/Slices/User";

const API_BASE_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : process.env.Deployed_link;

// MAIN COMPONENT
const DashboardGrid = () => {
    const [profile, setProfile] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const dispatch = useDispatch();

    // Resize on Mobile Device
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check if Token Exists
    useEffect(() => {
        if (!sessionStorage.getItem('jwtToken')) {

            alert("Please login first");
            window.location.href = '/';
        }
    }, [sessionStorage.getItem('jwtToken')]);

    // Fetech Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = sessionStorage.getItem('jwtToken');
                const response = await fetch(`${API_BASE_URL}/api/user_dashboard`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setProfile(data);

                dispatch(setPointsBalance(data.points_balance))
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }

        fetchProfile();
    }, []);

    // Fetch Wallet Data on Mount
    useEffect(() => {
        const fetchWallet = async () => {
            const response = await fetch(`${API_BASE_URL}/api/get_wallet`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`,
                },
            });

            const data = await response.json();

            dispatch(setWalletBalance(data.balance));
            dispatch(setLockedAmount(data.locked_amount));
            dispatch(setWalletAddress(data.wallet_addr));
        }

        fetchWallet();
    }, [])

    // Loading State
    if (!profile) return (
        <div className="flex h-full w-full justify-center items-center text-2xl text-black">
            Loading..
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#051B2A] to-[#0A2435] p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Profile & Balance */}
                <motion.div
                    className="lg:col-span-1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <ProfileCard profile={profile} />
                    <div className="mt-4 md:mt-6">
                        <BalanceSection profile={profile} />
                    </div>
                </motion.div>

                {/* Level & Active Tasks / Stakes */}
                <motion.div
                    className="lg:col-span-1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <LevelSection profile={profile} />
                    <div className="mt-4 md:mt-6">
                        <ActiveStakes isMobile={isMobile} />
                    </div>
                </motion.div>

                {/* History */}
                <motion.div
                    className="lg:col-span-1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <PlayerHistory />
                </motion.div>
            </div>
        </div>
    )
}

const ProfileCard = ({ profile }) => {
    return (
        <motion.div
            className="relative bg-gradient-to-br from-[#45BEA6] to-[#051B2A] rounded-2xl p-4 md:p-6 overflow-hidden backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
        >
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
                <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 p-1 backdrop-blur-md">
                        <img
                            src="/avatar.svg"
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover transform hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <motion.div
                        className="absolute -bottom-2 -right-2 bg-[#45BEA6] rounded-full p-2 shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Trophy size={20} className="text-white" />
                    </motion.div>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider">{profile?.full_name || 'Player'}</h2>
                    <p className="text-[#45BEA6] text-sm md:text-base">{profile?.email}</p>
                    <p className="text-white/80 text-sm md:text-base">{profile?.mobile}</p>
                </div>
            </div>
        </motion.div>
    );
};

const BalanceSection = ({ profile }) => {
    const [openRedeemPoints, setOpenRedeemPoints] = useState(false);
    const [openAddWallet, setOpenAddWallet] = useState(false);
    const [openNote, setOpenNote] = useState(false);
    const walletBalance = useSelector((state) => state.walletState.balance);
    const lockedSTC = useSelector((state) => state.walletState.locked_amount)
    const walletAddr = useSelector((state) => state.walletState.wallet_addr);
    const pointsBalance = useSelector((state) => state.userState.pointsBalance);
    const [showPoints, setShowPoints] = useState(false);

    // Handler - Open Redeem Coin Pop Up
    function handleOpenRedeemPoints() {
        if (walletAddr) {
            setOpenRedeemPoints(true) // Open Redeem Points Pop Up
        } else {
            setOpenNote(true); // Open note before Add Wallet Pop Up
        }
    }

    return (
        <>
            <motion.div
                className="bg-[#0A2435] rounded-2xl p-4 md:p-6 space-y-4 md:space-y-6 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <h3 className="text-lg md:text-xl font-bold text-white">Balance Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Current Balance */}
                    <motion.div
                        className="bg-gradient-to-br from-[#45BEA6]/20 to-transparent rounded-xl p-4 hover:from-[#45BEA6]/30 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center space-x-2">
                            <Coins className="text-[#45BEA6]" />
                            <span className="text-white">Current Balance</span>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-[#45BEA6] mt-2">{walletBalance.toLocaleString('en-US')}</p>
                    </motion.div>

                    {/* Locked STC / Staked Coins */}
                    <motion.div
                        className="relative bg-gradient-to-br from-gray-800/50 to-transparent rounded-xl p-4 hover:from-gray-800/60 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="absolute -top-2 -right-2">
                            <Lock className="text-[#45BEA6]" size={20} />
                        </div>
                        <span className="text-white">Staked Coins</span>
                        <p className="text-xl md:text-2xl font-bold text-gray-400 mt-2">{lockedSTC}</p>
                    </motion.div>

                    {/* My Points */}
                    <motion.div
                        className="bg-gradient-to-br from-[#45BEA6]/20 to-transparent rounded-xl p-4 hover:from-[#45BEA6]/30 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                    >
                        <button
                            onClick={() => setShowPoints(!showPoints)}
                            className="w-full text-left focus:outline-none"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-white">My Points</span>
                                <motion.div
                                    animate={{ rotate: showPoints ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {showPoints ? (
                                        <ChevronUp className="text-[#45BEA6]" />
                                    ) : (
                                        <ChevronDown className="text-[#45BEA6]" />
                                    )}
                                </motion.div>
                            </div>
                        </button>

                        {showPoints && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4"
                            >
                                <p className="text-xl md:text-2xl font-bold text-[#45BEA6]">
                                    {pointsBalance}
                                </p>
                                <motion.button
                                    className="mt-2 bg-[#45BEA6] text-white px-4 py-2 rounded-lg hover:bg-[#45BEA6]/80 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleOpenRedeemPoints}
                                >
                                    Redeem
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {/* Pop Up - Redeem Stake Coin */}
            <RedeemPointPopUp
                isOpen={openRedeemPoints}
                setOpen={setOpenRedeemPoints}
            />

            {/* Pop Up - Note before Connect Wallet */}
            {openNote &&
                <AddWalletNote
                    isOpen={openNote}
                    setOpenNote={setOpenNote}
                    setOpenAddWallet={setOpenAddWallet}
                />
            }

            {/* Pop Up - Connect Wallet */}
            {openAddWallet &&
                <AddWalletPopUp
                    isOpen={openAddWallet}
                    setOpenAddWallet={setOpenAddWallet}
                    setOpenRedeemCoin={setOpenRedeemPoints}
                />
            }
        </>
    );
};

const LevelSection = ({ profile }) => {
    // Satking Badges
    const levels = [
        { title: "Crypto Seed Sower" },
        { title: "Token Tycoon" },
        { title: "Stake Shark" },
        { title: "Profit Pioneer" },
        { title: "Blockchain Baron" },
        { title: "Crypto Czar" },
        { title: "Stake Sultan" },
        { title: "Ethereum Emperor" },
        { title: "Digital Dealmaker" },
        { title: "Wealth Weaver" },
        { title: "Liquidity Legend" },
        { title: "Blockchain Baller" },
        { title: "Crypto Chieftain" },
        { title: "DeFi Dynamo" },
        { title: "Wealth Whisperer" },
        { title: "Crypto Commander" },
        { title: "Yield Yogi" },
        { title: "Chain Champion" },
        { title: "Staking Strategist" },
        { title: "Satoshi Sage" }
    ];

    // Answer Badges
    const badges = [
        { title: "City Sleuth" },
        { title: "Urban Whisperer" },
        { title: "Concrete Conqueror" },
        { title: "Metro Maverick" },
        { title: "Skyline Sage" },
        { title: "Street Smart" },
        { title: "City Navigator" },
        { title: "District Dazzler" },
        { title: "Town Titan" },
        { title: "Block Boss" },
        { title: "Urban Detective" },
        { title: "Metro Guru" },
        { title: "Highway Hero" },
        { title: "Pavement Philosopher" },
        { title: "Cornerstone Champ" },
        { title: "Urban Pathbreaker" },
        { title: "Bridge Builder" },
        { title: "Traffic Tactician" },
        { title: "City Sentinel" },
        { title: "Asphalt Analyst" },
        { title: "Urban Oracle" },
        { title: "Skyway Specialist" },
        { title: "Boulevard Baron" },
        { title: "Street Specialist" },
        { title: "City Pulse Finder" },
        { title: "Urban Virtuoso" },
        { title: "Grit Guardian" },
        { title: "Alley Ace" },
        { title: "City Codecracker" },
        { title: "Route Rocketeer" },
        { title: "Crosswalk Captain" },
        { title: "Urban Vanguard" },
        { title: "Concrete Custodian" },
        { title: "City Circuitry" },
        { title: "Grid General" },
        { title: "City Scoutmaster" },
        { title: "Metropolis Maestro" },
        { title: "Skyway Strategist" },
        { title: "Avenue Ace" },
        { title: "Urban Navigator Extraordinaire" }
    ];

    const [selectedSection, setSelectedSection] = useState('levels');
    const currentLevel = profile.level;
    const currentBadgeLevel = badges.findIndex(badge => badge.title === profile.player_badge) + 1

    return (
        <motion.div
            className="bg-[#0A2435] rounded-2xl p-4 md:p-6 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
        >
            <div className="flex space-x-4 mb-6">
                <motion.button
                    className={`flex-1 py-2 rounded-lg transition-all duration-300 ${selectedSection === 'levels'
                        ? 'bg-gradient-to-r from-[#45BEA6] to-[#3AA189] text-white shadow-lg'
                        : 'bg-[#051B2A] text-[#45BEA6] hover:bg-[#051B2A]/80'
                        }`}
                    onClick={() => setSelectedSection('levels')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Levels
                </motion.button>
                <motion.button
                    className={`flex-1 py-2 rounded-lg transition-all duration-300 ${selectedSection === 'badges'
                        ? 'bg-gradient-to-r from-[#45BEA6] to-[#3AA189] text-white shadow-lg'
                        : 'bg-[#051B2A] text-[#45BEA6] hover:bg-[#051B2A]/80'
                        }`}
                    onClick={() => setSelectedSection('badges')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Badges
                </motion.button>
            </div>

            <div className="relative h-64 md:h-96 overflow-y-auto rounded-xl bg-[#051B2A]/50 p-4 scrollbar-thin scrollbar-thumb-[#45BEA6] scrollbar-track-transparent">
                {selectedSection === 'levels' ? (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                    >
                        {levels.map((level, idx) => {
                            const index = idx + 1;
                            return (
                                <motion.div
                                    key={index}
                                    className={`p-4 rounded-lg backdrop-blur-sm transition-all duration-300 ${index === currentLevel
                                        ? 'bg-[#45BEA6]/20 border-2 border-[#45BEA6] shadow-lg'
                                        : 'bg-[#051B2A] hover:bg-[#051B2A]/80'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-lg ${index <= currentLevel ? 'text-white' : 'text-gray-500'}`}>
                                            {level.title}
                                        </span>
                                        {index > currentLevel ? (
                                            <Lock className="text-gray-500" />
                                        ) : index === currentLevel && (
                                            <motion.div
                                                animate={{ rotate: [0, 360] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Award className="text-[#45BEA6]" />
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        {badges.map((badge, idx) => {
                            const index = idx + 1;
                            return (
                                <motion.div
                                    key={index}
                                    className={`bg-[#051B2A] p-4 md:p-6 rounded-lg backdrop-blur-sm transition-all duration-300 ${index === currentBadgeLevel ? 'border-2 border-[#45BEA6] shadow-lg' : ''}`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-lg ${index <= currentBadgeLevel ? 'text-white' : 'text-gray-500'}`}>
                                            {badge.title}
                                        </span>

                                        {index > currentBadgeLevel ?
                                            <span><Lock size={20} className="text-gray-500" /></span>
                                            :
                                            index === currentBadgeLevel && (
                                                <motion.div
                                                    animate={{ rotate: [0, 360] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Award className="text-[#45BEA6]" />
                                                </motion.div>
                                            )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

const ActiveStakes = ({ isMobile }) => {
    const [activeStakes, setActiveStakes] = useState([]);

    useEffect(() => {
        const fetchActiveStakes = async () => {
            try {
                const token = sessionStorage.getItem('jwtToken');
                const response = await fetch('http://localhost:5000/questions/active', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch active stakes');
                }
                const data = await response.json();
                setActiveStakes(data);
            } catch (error) {
                console.error('Error fetching active stakes:', error);
            }
        };

        fetchActiveStakes();
    }, []);

    return (
        <motion.div
            className="bg-[#0A2435] rounded-2xl p-4 md:p-6 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg md:text-xl font-bold text-white">Active Stakes</h3>
                <motion.div
                    className="bg-[#45BEA6]/20 px-3 py-1 rounded-full"
                    whileHover={{ scale: 1.1 }}
                >
                    <span className="text-[#45BEA6]">{activeStakes.length} Active</span>
                </motion.div>
            </div>

            <div className="space-y-4">
                {activeStakes.length > 0 ? (
                    activeStakes.map(({ stake, stakeDetails, staking_reward, time_left }, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#051B2A] p-4 rounded-lg hover:bg-[#051B2A]/80 transition-all duration-300"
                            whileHover={{ scale: 1.02, x: 10 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[#45BEA6] text-xs md:text-sm">Stake</p>
                                    <p className="text-white text-sm md:text-base">{stake}</p>
                                </div>
                                <div>
                                    <p className="text-[#45BEA6] text-xs md:text-sm">Details</p>
                                    <p className="text-white text-sm md:text-base">{stakeDetails}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <motion.div
                                    className="bg-[#45BEA6]/20 px-3 py-1 rounded-full"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <span className="text-[#45BEA6]">{staking_reward} STC</span>
                                </motion.div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-[#45BEA6] rounded-full animate-pulse"></div>
                                    <span className="text-white/60 text-xs md:text-sm">{time_left}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                    >
                        <motion.div
                            className="bg-[#051B2A] rounded-full p-4 inline-block mb-4"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Trophy className="text-[#45BEA6] w-6 h-6 md:w-8 md:h-8" />
                        </motion.div>
                        <p className="text-white mb-4 text-sm md:text-base">No active stakes yet</p>
                        <Link to="/explore">
                            <motion.button
                                className="bg-gradient-to-r from-[#45BEA6] to-[#3AA189] text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Create a Task
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </div>

            <Link to="/releaseStake">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full bg-gradient-to-r from-[#45BEA6] to-[#3AA189] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    Release Stakes
                </motion.button>
            </Link>
        </motion.div>
    );
};

const PlayerHistory = () => {
    const [activeTab, setActiveTab] = useState('completed');
    const [completedStakes, setCompletedStakes] = useState([]);
    const [releasedStakes, setReleasedStakes] = useState([]);

    // API - Fetch Completed Stakes
    const fetchCompletedStakes = async () => {
        try {
            const token = sessionStorage.getItem('jwtToken');
            const response = await fetch(`${API_BASE_URL}/api/user_history/answered`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setCompletedStakes(data);
        } catch (error) {
            console.error('Error fetching completed stakes:', error);
        }
    }

    // API - Fetch Released Stakes
    const fetchReleasedStakes = async () => {
        try {
            const token = sessionStorage.getItem('jwtToken');
            const response = await fetch(`${API_BASE_URL}/api/user_history/released_tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            setReleasedStakes(data);
        } catch (error) {
            console.error('Error fetching released stakes:', error);
        }
    }

    // Fetch Data on Mount
    useEffect(() => {
        fetchCompletedStakes();
        fetchReleasedStakes();
    }, []);

    if (!completedStakes) return <div>Loading..</div>

    return (
        <motion.div
            className="bg-[#0A2435] rounded-2xl p-4 md:p-6 h-full backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
        >
            {/* Title */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg md:text-xl font-bold text-white">Player History</h3>
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                >
                    <History className="text-[#45BEA6]" />
                </motion.div>
            </div>

            {/* Tabs - Completed / Released Stakes */}
            <div className="flex space-x-4 mb-6">
                <motion.button
                    className={`flex-1 py-2 rounded-lg transition-all duration-300 ${activeTab === 'completed'
                        ? 'bg-gradient-to-r from-[#45BEA6] to-[#3AA189] text-white shadow-lg'
                        : 'bg-[#051B2A] text-[#45BEA6] hover:bg-[#051B2A]/80'
                        }`}
                    onClick={() => setActiveTab('completed')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Completed Stakes
                </motion.button>
                <motion.button
                    className={`flex-1 py-2 rounded-lg transition-all duration-300 ${activeTab === 'released'
                        ? 'bg-gradient-to-r from-[#45BEA6] to-[#3AA189] text-white shadow-lg'
                        : 'bg-[#051B2A] text-[#45BEA6] hover:bg-[#051B2A]/80'
                        }`}
                    onClick={() => setActiveTab('released')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Released Stakes
                </motion.button>
            </div>

            {/* Details */}
            <div className="space-y-4">
                {activeTab === 'completed' ? (
                    completedStakes.length > 0 ? (completedStakes.map((stake, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#051B2A] p-4 rounded-lg hover:bg-[#051B2A]/80 transition-all duration-300"
                            whileHover={{ scale: 1.02, x: 10 }}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[#45BEA6] text-xs md:text-sm">{stake.date}</p>
                                    <p className="text-white text-sm md:text-base">{stake.taskTitle}</p>
                                </div>
                                <motion.div
                                    className="bg-[#45BEA6]/20 px-3 py-1 rounded-full"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <span className="text-[#45BEA6]">+{stake.rewardPoints}</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))
                    ) : (<div>Empty Data</div>)
                )
                    :
                    (releasedStakes.length > 0 ?
                        (releasedStakes.map((stake, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#051B2A] p-4 rounded-lg hover:bg-[#051B2A]/80 transition-all duration-300"
                                whileHover={{ scale: 1.02, x: 10 }}
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-[#45BEA6] text-xs md:text-sm">{stake.date}</p>
                                            <p className="text-white text-sm md:text-base">{stake.taskTitle}</p>
                                        </div>
                                        <motion.div
                                            className="bg-[#45BEA6]/20 px-3 py-1 rounded-full"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <span className="text-[#45BEA6]">{stake.stakeAmount * 100}</span>
                                        </motion.div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {stake.winners.map((winner, i) => (
                                            <span key={i} className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">{winner}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                        ) : (<div>Empty Data</div>)
                    )
                }
            </div>
        </motion.div>
    );
};

export default DashboardGrid