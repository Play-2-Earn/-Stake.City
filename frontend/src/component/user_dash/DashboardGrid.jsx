import React, {useState, useEffect} from "react";
import profileImage from '/avatar.svg';
import styles from "./Dashboard.module.css"
//import CircularProgress from "./CircularProgress";
import token from "/bitcoin-2207.svg"
import { Link } from "react-router-dom";
import History from "./history/History";


const DashboardGrid = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!sessionStorage.getItem('jwtToken')) {
            
            alert("Please login first");
            window.location.href = '/';
        }
    }, [sessionStorage.getItem('jwtToken')]);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = sessionStorage.getItem('jwtToken');
                const response = await fetch('http://localhost:5000/api/user_dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log(data);
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }

        fetchProfile();
    }, []);
    
    return (
        <div className={` h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-4 p-6 text-white min-h-screen ${styles.dashback} ${styles.starAnimation}`}>
            {/* Row 1 */}
            <div className="col-span-1">
                {/* Profile Column */}
                <ProfileSection profile={profile}/>
            </div>
            <div className="col-span-1">
                {/* Points Section */}
                <PointsSection profile={profile}/>
            </div>
            <div className="col-span-1">
                {/* History Section */}
                <LevelSection profile={profile} />
            </div>

            {/* Row 2 */}
            <div className="col-span-1">
                {/* Trophies Section */}
                <ActiveStakesSection />
            </div>
            <div className="col-span-2">
                {/* Level Section */}
                <HistorySection />
            </div>
        </div>

    )
}

const ProfileSection = ({profile}) => {
    
    //const navigate = useNavigate();
    
    return (
        <div className={`bg-gray-800 p-6 rounded-lg shadow-md shadow-[#20C997] text-center ${styles.float} size-full`}>
            <span className="text-[#F0F3F5] text-xl font-bold">Profile</span>
            <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4 mt-2"
            />

            <p className="text-[#F0F3F5] text-md">{profile ? profile.full_name : ''}</p>
            <p className="text-[#F0F3F5] text-sm font-semibold">Email: {profile ? profile.email : ''}</p>
            <p className="text-[#F0F3F5] text-sm font-semibold">Phone number: {profile ? profile.mobile : ''}</p>

            <button className=" user_dash mt-4 px-4 py-2 bg-[#20C997] rounded-3xl text-white">
                Customise me
            </button>
        </div>
    )
}

const stakes = [
    {
        username: "MJ23",
        stake: "What is the fastest way to...?",
        staking_reward: "200",
        time_left: "2hr30min",
    },
    {
        username: "MJ23",
        stake: "What is the fastest way to...?",
        staking_reward: "200",
        time_left: "2hr30min",
    },
    {
        username: "MJ23",
        stake: "What is the fastest way to...?",
        staking_reward: "200",
        time_left: "2hr30min",
    }
]

const ActiveStakesSection = () => {
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
        <div className={`bg-gray-800 p-6 rounded-lg shadow-md shadow-[#20C997] ${styles.float} size-full`}>
            <span className="text-lg font-semibold">Active Stakes</span>
        <div className="divide-y divide-[#A0AAB2]">
        
        {activeStakes.length > 0 ? activeStakes.map(({ stake, stakeDetails, staking_reward, time_left }, index) => (
            <div>
            <div className="flex justify-between py-3 text-sm font-semibold text-[#F0F2F5]">
            <div className="flex-1">Stake</div>
            <div className="flex-1">Details</div>
            <div className="flex-1 text-center">Reward</div>
            <div className="flex-1 text-right">Time Left</div>
            </div>
            <div
                key={index}
                className="flex items-center justify-between pb-3 pt-3 last:pb-0"
            >
                <div className="flex-1">
                    {stake}
                </div>
                <div className="flex-1">
                    {stakeDetails}
                </div>
                <div className="flex-1 text-center">
                    {staking_reward}
                </div>
                <div className="flex-1 text-right">
                    {time_left}
                </div>
            </div>
            </div>
        )):(
            <div>
                <Link to="/explore" className="text-[#20C997] font-semibold">No active stakes. Click here to create a task!</Link>
            </div>
        )}
    </div>

            <Link to="/releaseStake"> <button className=" mt-6 rounded-3xl mr-4 px-4 bg-emerald-400 py-2 shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out" >Release stakes </button></Link>
        </div>
    )
}

const PointsSection = () => {
    return (
        <div className={`bg-gray-800 p-6 rounded-lg shadow-md shadow-[#20C997] ${styles.float} size-full`}>
            <p className="text-lg font-semibold">Your Balance</p>
            <div className="flex items-center">
                <img src={token} alt="" className="w-12 h-12 p-1" />
                <span className="text-4xl font-bold text-[#20C997]">3456</span>
                {/*<button className="mt-1 px-4 py-2 text-white bg-[#20C997]">
                    Spend Tokens
                </button>*/}
            </div>
            <p className="font-semibold">Completed tasks</p>
            <ul className="mt-2 space-y-2">
                <li className="flex justify-between">
                    Complete a task <span className="text-[#20C997]">20</span>
                </li>
                <li className="flex justify-between">
                    Create a subtask <span className="text-[#20C997]">5</span>
                </li>
            </ul>
        </div>
    )
}

const LevelSection = ({profile}) => {
    return (
        <div className={`bg-gray-800 p-6 rounded-lg shadow-md shadow-[#20C997] justify-items-center ${styles.float} size-full`}>
            <span className="text-lg font-semibold">My Level</span>
            <p className="text-2xl font-bold">{profile ? profile.level : ''}</p>
            <p className="text-lg">Badges</p>
            <div className="bg-[#A00AB2]">{profile ? profile.reputation_badge : ''}<br></br>{profile ? profile.player_badge : ''}</div>
        </div>
    )
}

/*const QuestSection = () => {
    return (
        <div className={`bg-gray-800 p-6 rounded-lg shadow-md shadow-[#20C997] ${styles.float}`}>
            <span className="text-lg font-semibold">Next Quests</span>
            <ul className="mt-4 space-y-2">
                <li className="flex justify-between">
                    Complete a task <span className="text-[#20C997]">20</span>
                </li>
                <li className="flex justify-between">
                    Create a subtask <span className="text-[#20C997]">5</span>
                </li>
            </ul>
        </div>
    )
}*/

/*const LeaderboardSection = () => {
    return (
        <div className={`bg-gray-800 p-6 rounded-lg shadow-md shadow-[#20C997] ${styles.float}`}>
            <span className="text-xl font-bold">Leaderboard</span>
            <p className="text-md">This week</p>
        </div>
    )
}*/

const HistorySection = () => {
    const [historyPopUp, setHistoryPopUp] = useState(false);
    
    const historyPopUpOpen = () => {
        setHistoryPopUp(true)
    };

    const historyPopUpClose = () => {
        setHistoryPopUp(false)
    };
    return (
        <>
            <div className={`bg-gray-800 p-6 rounded-lg shadow-md shadow-[#20C997] ${styles.float} size-full`}>
                <span className="text-xl font-bold">History</span>
                <p>--</p>
                <button onClick={()=>historyPopUpOpen()} className=" user_dash mr-3 px-1 py-1 bg-[#20C997] rounded-3xl">Stakes</button>
                {/* <button className=" user_dash px-2 py-1 bg-[#20C997] rounded-3xl">Staking Reward</button> */}
            </div>
            <History isOpen={historyPopUp} onClose={() => historyPopUpClose()}/>
        </>
    )
}

export default DashboardGrid