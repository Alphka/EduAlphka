import { MdHome, MdLogout, MdOutlineMenuBook } from "react-icons/md"
import { APPLICATION_NAME } from "./constants"

const routes = {
	homepage: {
		title: "Dashboard",
		pathname: "/",
		Icon: MdHome
	},
	login: {
		title: "Login",
		pathname: "/login"
	},
	register: {
		title: "Registre-se",
		description: `Registre-se na plataforma ${APPLICATION_NAME}`,
		pathname: "/register"
	},
	accessDenied: {
		title: "Acesso negado",
		pathname: "/access-denied"
	},
	exam: {
		title: "Gerenciar testes",
		pathname: "/exam",
		// TODO: Use next.config.ts headers property to redirect this
		redirect: "/",
		Icon: MdOutlineMenuBook,
		children: {
			template: {
				title: "Teste",
				pathname: "/exam/[id]"
			},
			create: {
				title: "Criar testes",
				pathname: "/exam/create"
			}
		}
	},
	logout: {
		title: "Sair da conta",
		pathname: "/logout",
		Icon: MdLogout
	}
} as const

export default routes
