import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { z } from "zod"
import questionSchema from "./question"

const examSchema = z.object({
	title: z.string({
		invalid_type_error: "Título do teste inválido",
		required_error: "O título do teste é obrigatório"
	})
		.trim()
		.min(ExamFormValidation.titleMinLength, `O título do teste deve ter no mínimo ${ExamFormValidation.titleMinLength} caracteres`)
		.regex(new RegExp(GenericFormValidation.validSpecialNamePattern), "O título do teste contém caracteres inválidos"),
	description: z.string({
		invalid_type_error: "Descrição do teste inválida",
		required_error: "A descrição do teste é obrigatória"
	})
		.trim()
		.min(ExamFormValidation.descriptionMinLength, `A descrição do teste deve ter no mínimo ${ExamFormValidation.descriptionMinLength} caracteres`)
		.max(ExamFormValidation.descriptionMaxLength, `A descrição do teste deve ter no máximo ${ExamFormValidation.descriptionMaxLength} caracteres`)
		.regex(new RegExp(GenericFormValidation.validDescriptionPattern), "A descrição do teste contém caracteres inválidos"),
	subject: z.string({
		invalid_type_error: "Nome da disciplina inválido",
		required_error: "O nome da disciplina é obrigatório"
	})
		.trim()
		.min(ExamFormValidation.subjectMinLength, `O nome da disciplina deve ter no mínimo ${ExamFormValidation.subjectMinLength} caracteres`)
		.max(ExamFormValidation.subjectMaxLength, `O nome da disciplina deve ter no máximo ${ExamFormValidation.subjectMaxLength} caracteres`)
		.regex(new RegExp(GenericFormValidation.validSpecialNamePattern), "O nome da disciplina contém caracteres inválidos")
		.optional(),
	questions: z.array(questionSchema),
	duration: z.string({
		invalid_type_error: "Duração do teste inválida",
		required_error: "A duração do teste é obrigatória"
	})
		.regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "A duração do teste deve estar no formato HH:MM")
})

export default examSchema
