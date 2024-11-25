import { MdHome, MdLogout } from "react-icons/md"

const routes = {
	homepage: {
		pathname: "/",
		Icon: MdHome
	},
	login: {
		pathname: "/login"
	},
	logout: {
		pathname: "/logout",
		Icon: MdLogout
	},
	register: {
		pathname: "/register"
	},
	accessDenied: {
		pathname: "/access-denied"
	},
	exam: {
		pathname: "/exam",
		children: {
			create: {
				pathname: "/exam/create"
			}
		}
	}
} as const

export default routes
