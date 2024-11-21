import { APPLICATION_NAME } from "@app/constants"
import { GenericFormValidation } from "@app/constants/forms"

const ptBR = {
	homepage: {
		title: "Página inicial"
	},
	login: {
		title: "Login",
		description: "Entre ou registre-se na plataforma " + APPLICATION_NAME,
		form: {
			title: "Acesse sua conta",
			subtitle: "Entre com seu endereço de e-mail ou nome usuário",
			username: {
				label: "E-mail ou nome de usuário",
				placeholder:"exemplo@exemplo.com",
				validations: {
					invalid: "E-mail ou nome de usuário inválido",
					min: `O email ou nome de usuário deve ter no mínimo ${Math.min(GenericFormValidation.emailMinLength, GenericFormValidation.usernameMinLength)} caracteres`,
					max: `O email ou nome de usuário deve ter no máximo ${Math.max(GenericFormValidation.emailMaxLength, GenericFormValidation.usernameMaxLength)} caracteres`,
					invalidPattern: "O email ou nome de usuário contém caracteres inválidos"
				}
			},
			password: {
				label: "Senha",
				placeholder: "exemplo",
				eye: {
					show: "Mostrar senha",
					hide: "Esconder senha"
				},
				validations: {
					invalid: "Senha inválida",
					min: `A senha deve ter no mínimo ${GenericFormValidation.passwordMinLength} caracteres`,
					max: `A senha deve ter no máximo ${GenericFormValidation.passwordMaxLength} caracteres`,
					invalidPattern: "A senha contém caracteres inválidos"
				}
			},
			keepLoggedIn: {
				label: "Manter conectado"
			},
			forgotYourPassword: {
				text: "Esqueceu sua senha?"
			},
			send: {
				text: "Enviar",
				accessibilityText: "Enviar formulário"
			},
			register: {
				text: "Não tem uma conta? Crie uma agora mesmo!",
				accessibilityText: "Criar uma conta"
			},
			errors: {
				failedToAuthenticate: "Falha ao autenticar o usuário"
			}
		}
	},
	notFound: {
		title: "Página não encontrada"
	}
}

export default ptBR
