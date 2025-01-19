import { MdHome, MdLogout, MdOutlineMenuBook, MdPerson } from "react-icons/md"
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
		redirect: "/",
		access: "professor",
		Icon: MdOutlineMenuBook,
		children: {
			template: {
				title: "Teste",
				pathname: "/exam/[id]",
				children: {
					manage: {
						title: "Gerenciar teste",
						pathname: "/exam/[id]/manage"
					},
					submit: {
						title: "Realizar teste",
						pathname: "/exam/[id]/submit"
					}
				}
			},
			create: {
				title: "Criar teste",
				pathname: "/exam/create"
			},
			list: {
				title: "Testes criados",
				pathname: "/exam/list"
			}
		}
	},
	account: {
		title: "Minha conta",
		pathname: "/account",
		Icon: MdPerson
	},
	invite: {
		pathname: "/invite",
		redirect: "/",
		children: {
			template: {
				pathname: "/invite/[token]"
			}
		}
	},
	submit: {
		pathname: "/submit",
		redirect: "/",
		children: {
			template: {
				title: "Correção de teste",
				pathname: "/submit/[id]"
			}
		}
	},
	logout: {
		title: "Sair da conta",
		pathname: "/logout",
		Icon: MdLogout
	},
	recoverPassword: {
		title: "Recuperar senha",
		pathname: "/recover-password"
	}
} as const

export default routes
