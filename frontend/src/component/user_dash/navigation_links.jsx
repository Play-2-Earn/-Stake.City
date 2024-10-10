import {
	HiOutlineViewGrid,
	HiOutlineUsers,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog,
	HiOutlineClock,
	HiOutlineClipboardList
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'history',
		label: 'History',
		path: '/history',
		icon: <HiOutlineClock />
	},
	
	{
		key: 'friends',
		label: 'Friends',
		path: '/friends',
		icon: <HiOutlineUsers />
	},
	{
		key: 'leaderboard',
		label: 'Leaderboard',
		path: '/leaderboard',
		icon: <HiOutlineClipboardList />
	},
	{
		key: 'messages',
		label: 'Messages',
		path: '/messages',
		icon: <HiOutlineAnnotation />
	}
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/settings',
		icon: <HiOutlineCog />
	},
	{
		key: 'support',
		label: 'Help & Support',
		path: '/support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]