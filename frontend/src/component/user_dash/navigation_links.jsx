import {
	HiOutlineViewGrid,
	HiOutlineUsers,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog,
	HiOutlineClock,
	HiOutlineClipboardList
} from 'react-icons/hi'
import { FaGamepad } from "react-icons/fa";

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'explore',
		label: 'Explore',
		path: '/explore',
		icon: <FaGamepad />
	},
	{
		key: 'leaderboard',
		label: 'Leaderboard',
		path: '/leaderboard',
		icon: <HiOutlineClipboardList />
	},
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