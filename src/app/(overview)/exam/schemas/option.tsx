import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { z } from "zod"

const optionSchema = z.object({
	text: z.string({
		invalid_type_error: "Texto da opção inválido",
		required_error: "O texto da opção é obrigatório"
	})
		.trim()
		.min(ExamFormValidation.questionOptionMinLength, `O texto da opção deve ter no mínimo ${ExamFormValidation.questionOptionMinLength} caracteres`)
		.max(ExamFormValidation.questionOptionMaxLength, `O texto da opção deve ter no máximo ${ExamFormValidation.questionOptionMaxLength} caracteres`)
		.regex(new RegExp(GenericFormValidation.validDescriptionPattern), "O texto da opção contém caracteres inválidos")
})

export default optionSchema
