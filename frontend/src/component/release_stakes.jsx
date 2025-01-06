import React from "react";
import { useState, useEffect } from 'react'
import Header from "./header";
import Footer from "./footer";
import TaskReleasePopUp from "./popups/task_release_popup";
import { LoadingOutlined, RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

const ReleaseStake = () => {

    const [releasePopup, setReleaseTaskPopup] = useState(false)

    const [selectedItem, setSelectedItem] = useState(null)

    const [currentPageNum, setCurrentPageNum] = useState(1);





    const [activeStakes, setActiveStakes] = useState([]);
    const [spinner, setSpinner] = useState(true);
    // API - SSE to continously receive updated question/task/stake data
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        let isMounted = true;

        const fetchActiveTasks = async () => {
            try {
                const token = sessionStorage.getItem("jwtToken");
                if (!token) {
                    console.error("No JWT token found in session storage");
                    return;
                }

                const response = await fetch('http://localhost:5000/questions/active?include_answers=true', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'text/event-stream'
                    },
                    signal,
                });

                if (!response.ok) {
                    console.error('Failed to fetch active tasks');
                    return;
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (isMounted) {
                    try {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        const tasks = chunk
                            .split('\n')
                            .filter(line => line.startsWith('data: '))
                            .map(line => JSON.parse(line.substring(6)));

                        if (isMounted) {
                            tasks.forEach(setActiveStakes);
                            setSpinner(false)
                        }
                    } catch (readError) {
                        if (readError.name !== 'AbortError') {
                            console.error('Stream reading error:', readError);
                            break;
                        }
                    }
                }
            } catch (fetchError) {
                if (fetchError.name !== 'AbortError') {
                    console.error('Fetch error:', fetchError);
                }
            }
        };

        fetchActiveTasks();

        // Cleanup to prevent memory leaks
        return () => {
            isMounted = false;
            controller.abort();
        }
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
        console.log(...answers)

        setSelectedItem(clickedItem);
    }

    const taskPoupClose = () => {
        setReleaseTaskPopup(false)
    }
    const navigate = useNavigate()
    return (
        <>
            <Header />
            <div className="flex justify-start items-center mt-10 w-[85%] mx-auto gap-10">
            <RollbackOutlined style={{ fontSize: '32px' , cursor:'pointer'}} onClick={() => navigate('/userdashboard')}/>
            <h1 className="text-center justify-self-end  ">Current Stakes</h1>
            </div>

            <div className="mx-24 mt-12 px-10 py-6 rounded-xl bg-slate-800 ">
                <div className=" flex flex-wrap flex-col justify-center">
                    {
                    spinner ?
                        <Spin  indicator={<LoadingOutlined style={{ fontSize: '48px', color: '#34D399' }} spin />} size="large" />
                    :
                        (<table className="border-separate border-spacing-y-4 w-full">
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
                                    <tr className="text-center h-[50px] hover:bg-slate-600" key={question_id || index}>
                                        <td className="text-slate-400">{index + 1}</td>
                                        <td className="text-slate-400">{stake}</td>
                                        <td className="text-slate-400">{stakeDetails}</td>
                                        <td className="text-slate-400">{staking_reward}</td>
                                        <td className="text-slate-400">{time_left}</td>
                                        <td>
                                            <button onClick={() => taskPoupOpen(stake, staking_reward, time_left, answers, question_id)} className="w-[140px] rounded-3xl bg-emerald-400 py-1 px-2 text-sm shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-shadow transition-2 ease-in-out">Release Stake</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-slate-400">No active stakes found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>)}
                </div>
                {
                !spinner
                 &&
                  <div className="mt-5 flex gap-4 justify-start ">
                    <button
                        onClick={() => prePage()}
                        className="w-[100px] rounded-3xl bg-emerald-400 py-1 px-2 text-sm shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-transform duration-300 ease-in-out hover:rotate-[5deg]"
                    >
                        Previous
                    </button>

                    <button
                        onClick={() => nextPage()}
                        className="w-[100px] rounded-3xl bg-emerald-400 py-1 px-2 text-sm shadow-lg shadow-emerald-800 hover:bg-emerald-300 hover:text-grey hover:shadow-sm hover:shadow-emerald-500 transition-transform duration-300 ease-in-out hover:rotate-[5deg]"
                    >
                        Next
                    </button>
                </div>
                }
            </div>
            <Footer />
            <TaskReleasePopUp isOpen={releasePopup} onClose={() => taskPoupClose()} displayDetails={selectedItem} />
        </>
    )
}

export default ReleaseStake;
