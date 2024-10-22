import React from "react";
import { useState, useEffect } from 'react'
import Header from "./header";
import Footer from "./footer";
import TaskReleasePopUp from "./popups/task_release_popup";

const ReleaseStake = () => {
    const stakes = [
        {
            username: "Traveler101",
            stake: "How to pack light for a 2-week trip, including tips for minimizing toiletries?",
            staking_reward: "250",
            time_left: "5hr20min",
            answers: [
                {
                    username: "GlobeTrotter",
                    response: "Use travel-sized bottles for toiletries, and stick to multi-purpose products like shampoo and body wash in one. Roll your clothes instead of folding to save space."
                },
                {
                    username: "PackLightExpert",
                    response: "Limit yourself to one pair of shoes and pack neutral clothing items that can be mixed and matched. Solid toiletries are a great option to save on liquid space."
                },
                {
                    username: "PackLightExpert",
                    response: "Limit yourself to one pair of shoes and pack neutral clothing items that can be mixed and matched. Solid toiletries are a great option to save on liquid space."
                },
                {
                    username: "PackLightExpert",
                    response: "Limit yourself to one pair of shoes and pack neutral clothing items that can be mixed and matched. Solid toiletries are a great option to save on liquid space."
                },
                {
                    username: "PackLightExpert",
                    response: "Limit yourself to one pair of shoes and pack neutral clothing items that can be mixed and matched. Solid toiletries are a great option to save on liquid space."
                },

                {
                    username: "MinimalistTraveler",
                    response: "Focus on packing lightweight, quick-dry fabrics. You can also buy toiletries at your destination to avoid carrying too much."
                }
            ]
        },
        {
            username: "ChefAlex",
            stake: "What’s the best recipe for homemade pizza, with a crispy crust?",
            staking_reward: "300",
            time_left: "2hr5min",
            answers: [
                {
                    username: "FoodieGuy",
                    response: "Try a thin dough made with high-gluten flour and preheat your oven with a pizza stone at 500°F. Bake the pizza for 8-10 minutes for that crispy crust."
                },
                {
                    username: "BakingQueen",
                    response: "Use cold fermentation for the dough over 24 hours to enhance flavor. Make sure to use a hot cast-iron pan or a pizza stone for an even bake."
                },
                {
                    username: "ItalianChef",
                    response: "Use 00 flour for an authentic Italian-style crust, and drizzle olive oil over the edges before baking for extra crispiness."
                }
            ]
        },
        {
            username: "FitnessGuru",
            stake: "Quickest way to improve stamina, especially for running?",
            staking_reward: "450",
            time_left: "1hr10min",
            answers: [
                {
                    username: "RunFast",
                    response: "Incorporate interval training into your routine, mixing sprints with recovery jogs. Increase your mileage gradually and focus on consistent training."
                },
                {
                    username: "CardioKing",
                    response: "Add hill sprints to your training. It builds strength and stamina simultaneously. Also, make sure to fuel your body properly with balanced nutrition."
                },
                {
                    username: "EnduranceCoach",
                    response: "Focus on long, steady runs at a comfortable pace to build your aerobic base. Cross-training with cycling or swimming can also help improve stamina."
                }
            ]
        },
        {
            username: "MusicLover",
            stake: "How to learn guitar in 30 days, focusing on basic chords?",
            staking_reward: "400",
            time_left: "3hr50min",
            answers: [
                {
                    username: "GuitarPro",
                    response: "Start with the basic chords: C, G, D, E, and A. Practice transitioning between them smoothly and learn a simple song to build muscle memory."
                },
                {
                    username: "ChordMaster",
                    response: "Practice strumming patterns alongside basic chords. Use online tutorials to play easy songs that only use two or three chords."
                },
                {
                    username: "MusicCoach",
                    response: "Set aside 15-20 minutes daily for practice. Focus on finger placement and rhythm. Apps like Yousician can help with daily practice routines."
                }
            ]
        },
        {
            username: "MovieBuff",
            stake: "Top 5 classic movies to watch for a film enthusiast?",
            staking_reward: "180",
            time_left: "6hr45min",
            answers: [
                {
                    username: "CinemaExpert",
                    response: "For classics, watch 'Citizen Kane', 'Casablanca', 'The Godfather', 'Psycho', and '2001: A Space Odyssey'. These films are essential for any movie lover."
                },
                {
                    username: "FilmCritic",
                    response: "'Gone with the Wind', 'Vertigo', and 'The Wizard of Oz' are also must-watch films that have shaped the industry."
                },
                {
                    username: "RetroReel",
                    response: "Don't miss 'Rear Window' and 'Dr. Strangelove'. They're not only entertaining but also highly influential in cinema history."
                }
            ]
        },
        {
            username: "Artist123",
            stake: "Techniques for blending colors in digital art, especially for realistic portraits?",
            staking_reward: "220",
            time_left: "2hr30min",
            answers: [
                {
                    username: "ArtWizard",
                    response: "Use soft round brushes with low opacity and build up the colors gradually. Smudge tools and layer modes like 'Multiply' and 'Overlay' are also helpful."
                },
                {
                    username: "DigitalPainter",
                    response: "Work on separate layers for skin tones, shadows, and highlights. Adjust the opacity for a smooth blend without losing detail."
                },
                {
                    username: "ColorBlender",
                    response: "Utilize gradient maps for creating smooth transitions between colors. Experiment with different brush textures for more realistic skin."
                }
            ]
        },
        {
            username: "NatureFan",
            stake: "Best spots for hiking in the Rockies, with scenic views?",
            staking_reward: "350",
            time_left: "4hr25min",
            answers: [
                {
                    username: "TrailBlazer",
                    response: "Check out Trail Ridge Road in Rocky Mountain National Park and Emerald Lake Trail. Both offer stunning alpine scenery and varied wildlife."
                },
                {
                    username: "MountainExplorer",
                    response: "Try Grays and Torreys Peaks if you're up for a challenge. They offer breathtaking summit views and are perfect for experienced hikers."
                },
                {
                    username: "NatureGuide",
                    response: "The Maroon Bells are a must-see. The hike is moderate but provides incredible photo opportunities and mountain reflections."
                }
            ]
        },
        {
            username: "BookWorm",
            stake: "What are some must-read fantasy novels, particularly with strong world-building?",
            staking_reward: "500",
            time_left: "1hr55min",
            answers: [
                {
                    username: "StorySeeker",
                    response: "'The Lord of the Rings', 'A Song of Ice and Fire', and 'The Name of the Wind' are excellent choices for immersive worlds. Try 'Mistborn' and 'The Wheel of Time' as well."
                },
                {
                    username: "FantasyFanatic",
                    response: "'The Stormlight Archive' series is fantastic for epic storytelling, and 'The Broken Empire' series has a unique dark fantasy setting."
                },
                {
                    username: "NovelLover",
                    response: "Don't miss 'The Witcher' series for its unique folklore elements and 'The First Law' trilogy for a gritty and realistic approach to fantasy."
                }
            ]
        },
        {
            username: "TechieJoe",
            stake: "How to set up a home server, with a focus on media streaming?",
            staking_reward: "600",
            time_left: "2hr45min",
            answers: [
                {
                    username: "ServerGuru",
                    response: "Use software like Plex or Jellyfin for media streaming. Make sure your home server has a strong CPU and adequate storage, and connect it to your home network via Ethernet for better speed."
                },
                {
                    username: "TechMaster",
                    response: "Try using Unraid or FreeNAS as your server OS for flexibility. Also, set up RAID for better data protection and access speed."
                },
                {
                    username: "MediaSetupPro",
                    response: "If you're new, start with a Raspberry Pi running Kodi. It’s a budget-friendly way to set up a basic media server with decent streaming quality."
                }
            ]
        },
        {
            username: "ScienceGeek",
            stake: "Easiest way to understand quantum mechanics, for beginners?",
            staking_reward: "700",
            time_left: "5hr35min",
            answers: [
                {
                    username: "PhysicsNerd",
                    response: "Start with the double-slit experiment to understand wave-particle duality. Books like 'Quantum Mechanics: The Theoretical Minimum' are great for beginners."
                },
                {
                    username: "ScienceTutor",
                    response: "Watch YouTube channels like 'PBS Space Time' or 'Veritasium' for visual explanations. They simplify complex concepts into digestible lessons."
                },
                {
                    username: "QuantumEnthusiast",
                    response: "Explore the basics through online courses like those on Coursera or Khan Academy. These platforms offer step-by-step lessons suited for beginners."
                }
            ]
        }
    ];


    const [releasePopup, setReleaseTaskPopup] = useState(false)

    const [selectedItem, setSelectedItem] = useState(null)

    const [currentPageNum, setCurrentPageNum] = useState(1);

    const cellPerPage = 5;

    const totPages = Math.ceil(stakes.length / cellPerPage)

    const indexOfLastEle = cellPerPage * currentPageNum

    const indexOfFirstEle = indexOfLastEle - cellPerPage

    const currentPageItems = stakes.splice(indexOfFirstEle, indexOfLastEle)
    const [activeStakes, setActiveStakes] = useState([]);

    useEffect(() => {
        const fetchActiveStakes = async () => {
            try {
                const token = sessionStorage.getItem('jwtToken');
                const response = await fetch('http://localhost:5000/questions/active?include_answers=true', {
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
    const nextPage = () => {
        if (currentPageNum === totPages) {
            alert("You are already on the last page.")
        }
        else {
            setCurrentPageNum(currentPageNum + 1);
        }
    }

    const prePage = () => {
        if (currentPageNum === 1) {
            alert("You are already on the first page..")
        }
        else {
            setCurrentPageNum(currentPageNum - 1);
        }
    }

    const taskPoupOpen = (stake, staking_reward, time_left, answers, question_id) => {
        setReleaseTaskPopup(true);

        const clickedItem = [stake, staking_reward, time_left, answers, question_id];

        setSelectedItem(clickedItem);
    }

    const taskPoupClose = () => {
        setReleaseTaskPopup(false)
    }
    return (
        <>
            <Header />
            <h1 className="text-center mt-10">Current Stakes</h1>
            <div className="mx-24 mt-12 px-10 py-6 rounded-xl bg-slate-800 ">
                <div className=" flex flex-wrap flex-col justify-center">
                    <table>
                        <thead>
                            <tr>
                                <th className=" font-bold text-xl ">No</th>
                                <th className=" font-bold text-xl ">Stake</th>
                                <th className=" font-bold text-xl ">Stake Details</th>
                                <th className=" font-bold text-xl ">Staking Reward</th>
                                <th className=" font-bold text-xl ">Time Left</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeStakes.length > 0 ? activeStakes.map(({ stake, stakeDetails, staking_reward, time_left, answers, question_id }, index) => (
                                <tr className="text-center hover:bg-slate-600" key={question_id || index}>
                                    <td className="text-slate-400">{index + 1}</td>
                                    <td className="text-slate-400">{stake}</td>
                                    <td className="text-slate-400">{stakeDetails}</td>
                                    <td className="text-slate-400">{staking_reward}</td>
                                    <td className="text-slate-400">{time_left}</td>
                                    <td>
                                        <button onClick={() => taskPoupOpen(stake, staking_reward, time_left, answers, question_id)} className="rounded-3xl bg-emerald-400 py-1 px-2 text-sm shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out">Release Stake</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-slate-400">No active stakes found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-2">
                    <button onClick={() => prePage()} className="rounded-3xl bg-emerald-400 py-1 px-2 text-sm shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out"  >Previous</button>
                    <button onClick={() => nextPage()} className="rounded-3xl bg-emerald-400 py-1 px-2 text-sm shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out" >next</button>
                </div>
            </div>
            <Footer />
            <TaskReleasePopUp isOpen={releasePopup} onClose={() => taskPoupClose()} displayDetails={selectedItem} />
        </>
    )
}

export default ReleaseStake;