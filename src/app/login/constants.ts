import { z } from "zod"

export const validPasswordPattern = "^[\\w~\`! @#$%^&*\\(\\)+=\\{\\}\\[\\]\\|\\;:\"<>,.\\/?\\-]+$"

export const loginSchema = z.object({
	username: z.string({ invalid_type_error: "E-mail ou nome de usuário inválido" }),
	password: z.string({ invalid_type_error: "Senha inválida" })
		.min(6, "A senha deve ter no mínimo 6 caracteres")
		.max(255, "A senha deve ter no máximo 255 caracteres")
		.regex(new RegExp(validPasswordPattern), "A senha contém caracteres inválidos")
})
