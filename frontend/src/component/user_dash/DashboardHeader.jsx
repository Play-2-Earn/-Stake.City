import React, { Fragment } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import { HiOutlineBell, HiOutlineSearch, HiOutlineChatAlt } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import profileImage from '/avatar.svg';

export default function DashboardHeader({toggleSidebar}) {
    const navigate = useNavigate()
	
	const handleSignOut = () => {
		sessionStorage.removeItem('jwtToken')
		navigate('/')
	}
    return (
        <div className="bg-[#0D1B2A] h-14 px-4 flex justify-between items-center ">
            <div className="relative w-full sm:w-[24rem] mr-2">
				<HiOutlineSearch fontSize={20} className="text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
				{/*<input
					type="text"
					placeholder="Search..."
					className="w-full sm:w-[24rem] text-sm focus:outline-none active:outline-none border border-gray-300 w-[24rem] h-10 pl-11 pr-4 rounded-sm"
				/>*/}
			</div>
            <div className="flex items-center gap-2 mr-2">
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
                <Popover className="relative">
					{({ open }) => (
						<>
							<Popover.Button
								className={classNames(
									open && 'bg-[#20C997]',
									'group inline-flex items-center rounded-sm p-1.5 text-white hover:text-opacity-100 focus:outline-none active:bg-[#20C997]'
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
                <Menu as="div" className="relative">
					<div>
						<Menu.Button 
							onClick={toggleSidebar}
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
										Your Profile
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
            </div>
        </div>
    )
}