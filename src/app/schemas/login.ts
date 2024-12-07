import { GenericFormValidation } from "@constants/forms"
import { z } from "zod"

export const emailString = z.string({
	required_error: "O email é obrigatório",
	invalid_type_error: "E-mail inválido"
})
	.trim()
	.toLowerCase()
	.min(GenericFormValidation.emailMinLength, `O email deve ter no mínimo ${GenericFormValidation.emailMinLength} caracteres`)
	.max(GenericFormValidation.emailMaxLength, `O email deve ter no máximo ${GenericFormValidation.emailMaxLength} caracteres`)
	.email("Email inválido")
	.regex(new RegExp(GenericFormValidation.validEmailPattern), "Email inválido")

export const usernameString = z.string({
	required_error: "O nome de usuário é obrigatório",
	invalid_type_error: "Nome de usuário inválido"
})
	.trim()
	.min(GenericFormValidation.usernameMinLength, `O nome de usuário deve ter no mínimo ${GenericFormValidation.usernameMinLength} caracteres`)
	.max(GenericFormValidation.usernameMaxLength, `O nome de usuário deve ter no máximo ${GenericFormValidation.usernameMaxLength} caracteres`)
	.regex(new RegExp(GenericFormValidation.validUsernamePattern), "O nome de usuário contém caracteres inválidos")

export const passwordString = z.string({
	required_error: "A senha é obrigatória",
	invalid_type_error: "Senha inválida"
})
	.trim()
	.min(GenericFormValidation.passwordMinLength, `A senha deve ter no mínimo ${GenericFormValidation.passwordMinLength} caracteres`)
	.max(GenericFormValidation.passwordMaxLength, `A senha deve ter no máximo ${GenericFormValidation.passwordMaxLength} caracteres`)
	.regex(new RegExp(GenericFormValidation.validPasswordPattern), "A senha contém caracteres inválidos")

export const keepLoggedInSchema = z.boolean({
	required_error: "O campo 'Manter conectado' é obrigatório",
	invalid_type_error: "Tipo inválido para o campo 'Manter conectado'"
})

const loginSchema = z.object({
	email: emailString.optional(),
	username: usernameString.optional(),
	password: passwordString,
	keep_logged_in: keepLoggedInSchema
}).superRefine(({ email, username }, refinementContext) => {
	if(
		(!email && !username) ||
		(typeof email !== "string" && typeof username !== "string") ||
		(!email?.trim() && !username?.trim())
	){
		return refinementContext.addIssue({
			code: z.ZodIssueCode.custom,
			message: "O nome de usuário ou e-mail é obrigatório",
			path: ["username"]
		})
	}
})

export default loginSchema
