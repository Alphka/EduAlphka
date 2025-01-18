import { PasswordRecoveryFormValidation } from "@constants/forms"
import { emailString, passwordString } from "./login"
import { z } from "zod"

const passwordRecoverySchema = z.object({
	email: emailString,
	password: passwordString,
	code: z.string({
		required_error: "O código de verificação é obrigatório",
		invalid_type_error: "Código de verificação inválido"
	})
		.trim()
		.regex(new RegExp(`^\\d{${PasswordRecoveryFormValidation.codeLength}}$`), "O código de verificação deve conter apenas números")
		.length(PasswordRecoveryFormValidation.codeLength, `O código de verificação deve ter ${PasswordRecoveryFormValidation.codeLength} caracteres`)
})

export default passwordRecoverySchema
