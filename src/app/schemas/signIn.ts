import { emailString, keepLoggedInSchema, passwordString, usernameString } from "@app/schemas/login"
import { GenericFormValidation } from "@constants/forms"
import { ACCOUNT_TYPES } from "@models/User"
import { z } from "zod"

export const nameString = z.string({ invalid_type_error: "Nome inválido" })
	.trim()
	.min(GenericFormValidation.nameMinLength, `O nome deve ter no mínimo ${GenericFormValidation.nameMinLength} caracteres`)
	.max(GenericFormValidation.nameMaxLength, `O nome deve ter no máximo ${GenericFormValidation.nameMaxLength} caracteres`)
	.regex(new RegExp(GenericFormValidation.validNamePattern), "O nome contém caracteres inválidos")

const signInSchema = z.object({
	name: nameString,
	email: emailString,
	username: usernameString,
	password: passwordString,
	account_type: z.enum(ACCOUNT_TYPES, {
		invalid_type_error: "Tipo de conta inválido",
		required_error: "O tipo de conta é obrigatório"
	}),
	keep_logged_in: keepLoggedInSchema
})

export default signInSchema
