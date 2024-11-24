import { GenericFormValidation } from "@constants/forms"
import { APPLICATION_NAME } from "@constants"

const pt = {
	homepage: {
		title: "Página inicial"
	},
	login: {
		title: "Login",
		description: "Entre ou registre-se na plataforma " + APPLICATION_NAME,
		form: {
			title: "Acesse sua conta",
			subtitle: "Entre com seu endereço de e-mail ou nome usuário",
			forgotYourPassword: {
				text: "Esqueceu sua senha?"
			},
			send: {
				text: "Continuar",
				accessibilityText: "Entrar na conta"
			},
			register: {
				text: "Não tem uma conta? Crie uma agora mesmo!",
				accessibilityText: "Criar uma conta"
			},
			errors: {
				invalidCredentials: "Invalid credentials",
				failedToAuthenticate: "Falha ao autenticar o usuário"
			}
		}
	},
	logout: {
		title: "Sair da conta"
	},
	register: {
		title: "Regitre-se",
		description: "Registre-se na plataforma " + APPLICATION_NAME,
		form: {
			title: "Crie uma conta",
			subtitle: "Junte-se à nossa plataforma de testes online e comece sua jornada de aprendizado!",
			send: {
				text: "Continuar",
				accessibilityText: "Criar conta"
			},
			errors: {
				emailAlreadyInUse: "Esse e-mail já está em uso",
				usernameAlreadyInUse: "Esse nome de usuário já está em uso",
				credentialsAlreadyInUse: "Essas credenciais já estão em uso",
				failedToRegister: "Falha ao registrar o usuário",
			}
		}
	},
	notFound: {
		title: "Página não encontrada"
	},
	inputs: {
		name: {
			label: "Nome",
			placeholder:"Digite o seu nome",
			validations: {
				invalid: "Nome inválido",
				min: `O nome deve ter no mínimo ${GenericFormValidation.nameMinLength} caracteres`,
				max: `O nome deve ter no máximo ${GenericFormValidation.nameMaxLength} caracteres`,
				invalidPattern: "O nome contém caracteres inválidos"
			}
		},
		email: {
			label: "E-mail",
			placeholder:"Digite o seu endereço de e-mail",
			validations: {
				invalid: "E-mail inválido",
				min: `O email deve ter no mínimo ${GenericFormValidation.emailMinLength} caracteres`,
				max: `O email deve ter no máximo ${GenericFormValidation.emailMaxLength} caracteres`,
				invalidPattern: "O email contém caracteres inválidos"
			}
		},
		username: {
			label: "Nome de usuário",
			placeholder:"Digite o seu nome de usuário",
			validations: {
				invalid: "Nome de usuário inválido",
				min: `O nome de usuário deve ter no mínimo ${GenericFormValidation.usernameMinLength} caracteres`,
				max: `O nome de usuário deve ter no máximo ${GenericFormValidation.usernameMaxLength} caracteres`,
				invalidPattern: "O nome de usuário contém caracteres inválidos"
			}
		},
		emailOrUsername: {
			label: "E-mail ou nome de usuário",
			placeholder:"Digite o seu e-mail ou nome de usuário",
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
		accountType: {
			label: "Tipo de conta",
			professor: {
				text: "Aplicador de testes"
			},
			candidate: {
				text: "Candidato"
			},
			validations: {
				invalid: "Tipo de conta inválido"
			}
		}
	},
	genericErrors: {
		somethingWentWrong: "Algo deu errado"
	}
}

export default pt
