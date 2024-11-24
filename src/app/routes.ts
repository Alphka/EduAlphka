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
	}
}

export default routes
