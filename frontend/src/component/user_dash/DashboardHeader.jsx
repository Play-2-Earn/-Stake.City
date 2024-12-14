import React, { Fragment, useEffect, useState } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import { HiOutlineBell, HiOutlineSearch, HiOutlineChatAlt } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import profileImage from '/avatar.svg';
import mainlogo from '/mainLogo.png'
import { FaGamepad } from "react-icons/fa";

export default function DashboardHeader({ toggleSidebar }) {
	const navigate = useNavigate()
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const handleSignOut = () => {
		sessionStorage.removeItem('jwtToken')
		navigate('/')
	}

	// Track Current Windows Size
	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		// Add event listener to track window resize
		window.addEventListener('resize', handleResize);

		// Cleanup event listener on component unmount
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div className="bg-[#0D1B2A] h-fit flex flex-row justify-between items-center px-5">
			{/* Back to Game - Desktop View */}
			<Link
				to="/explore"
				className='sm:flex flex-row items-center gap-2 hover:scale-105 hover:-translate-y-1 transition ease-linear hover:text-emarald-1 overflow-visible hover:rotate-3 font-bold hidden'
			>
				<FaGamepad size={27} /> Explore
			</Link>

			{/* Home Icon */}
			<Link
				to="/"
			>
				<img src={mainlogo} alt="Stake_city" className="w-[5.5em] p-3" />
			</Link>

			{/* Back to Game - Mobile View */}
			<Link
				to="/explore"
				className='sm:hidden flex flex-row items-center gap-2 hover:scale-105 hover:-translate-y-1 transition ease-linear hover:text-emarald-1 overflow-visible hover:rotate-3 font-bold'
			>
				<FaGamepad size={27} /> Explore
			</Link>

			{/* Dashboard / Profile Navigation */}
			<div className="flex items-center gap-2 mr-2">
				{/* Message */}
				<Popover className="relative">
					{({ open }) => (
						<>
							<Popover.Button
								className={classNames(
									open && 'bg-[#20C997]',
									'group inline-flex items-center rounded-sm p-1.5 text-white hover:text-opacity-100 focus:outline-none active:bg-[#20C997]'
								)}
							>
								<HiOutlineChatAlt fontSize={24} />
							</Popover.Button>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-200"
								enterFrom="opacity-0 translate-y-1"
								enterTo="opacity-100 translate-y-0"
								leave="transition ease-in duration-150"
								leaveFrom="opacity-100 translate-y-0"
								leaveTo="opacity-0 translate-y-1"
							>
								<Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
									<div className="bg-[#0D1B2A] rounded-sm shadow-sm shadow-[#20C997] ring-1 ring-black ring-opacity-5 px-2 py-2.5">
										<strong className="text-[#F0F3F5] font-medium">Messages</strong>
										<div className="text-[#F0F3F5] mt-2 py-1 text-sm">This is messages panel.</div>
									</div>
								</Popover.Panel>
							</Transition>
						</>
					)}
				</Popover>

				{/* Notificatoins */}
				<Popover className="relative">
					{({ open }) => (
						<>
							<Popover.Button
								className={classNames(
									open && 'bg-[#20C997]',
									'group sm:inline-flex items-center rounded-sm p-1.5 text-white hover:text-opacity-100 focus:outline-none active:bg-[#20C997] hidden'
								)}
							>
								<HiOutlineBell fontSize={24} />
							</Popover.Button>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-200"
								enterFrom="opacity-0 translate-y-1"
								enterTo="opacity-100 translate-y-0"
								leave="transition ease-in duration-150"
								leaveFrom="opacity-100 translate-y-0"
								leaveTo="opacity-0 translate-y-1"
							>
								<Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
									<div className="bg-[#0D1B2A] rounded-sm shadow-sm shadow-[#20C997] ring-1 ring-black ring-opacity-5 px-2 py-2.5">
										<strong className="text-[#F0F3F5] font-medium">Notifications</strong>
										<div className="text-[#F0F3F5] mt-2 py-1 text-sm">This is notification panel.</div>
									</div>
								</Popover.Panel>
							</Transition>
						</>
					)}
				</Popover>

				{/* Profile Icon */}
				{windowWidth >= 768 ?
					( // Desktop Version
						<Menu as="div" className="relative">
							<div>
								<Menu.Button
									className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400"
								>
									<span className="sr-only">Open user menu</span>
									<div
										className="h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center"
										style={{ backgroundImage: `url(${profileImage})` }}
									>
									</div>
								</Menu.Button>
							</div>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-100"
								enterFrom="transform opacity-0 scale-95"
								enterTo="transform opacity-100 scale-100"
								leave="transition ease-in duration-75"
								leaveFrom="transform opacity-100 scale-100"
								leaveTo="transform opacity-0 scale-95"
							>
								<Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-sm shadow-[#20C997] p-1 bg-[#0D1B2A] ring-1 ring-black ring-opacity-5 focus:outline-none">
									<Menu.Item>
										{({ active }) => (
											<div
												onClick={() => navigate('/profile')}
												className={classNames(
													active && 'bg-[#A0AAB2]',
													'active:bg-[#A0AAB2] rounded-sm px-4 py-2 text-[#F0F3F5] cursor-pointer focus:bg-[#A0AAB2]'
												)}
											>
												Profile
											</div>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<div
												onClick={() => navigate('/settings')}
												className={classNames(
													active && 'bg-[#A0AAB2]',
													'active:bg-[#A0AAB2] rounded-sm px-4 py-2 text-[#F0F3F5] cursor-pointer focus:bg-[#A0AAB2]'
												)}
											>
												Settings
											</div>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<Menu.Item>
												{({ active }) => (
													<div
														onClick={() => handleSignOut()}
														className={classNames(
															active && 'bg-[#A0AAB2]',
															'active:bg-[#A0AAB2] rounded-sm px-4 py-2 text-[#F0F3F5] cursor-pointer focus:bg-[#A0AAB2]'
														)}
													>
														Sign out
													</div>
												)}
											</Menu.Item>
										)}
									</Menu.Item>
								</Menu.Items>
							</Transition>
						</Menu>
					) :
					( // Mobile Version
						<div className='flex flex-row gap-2 items-center mr-2'>
							{/* Message */}
							<button
								onClick={toggleSidebar}
								className="h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center"
								style={{ backgroundImage: `url(${profileImage})` }}
							/>
						</div>
					)
				}
			</div>
		</div >
	)
}