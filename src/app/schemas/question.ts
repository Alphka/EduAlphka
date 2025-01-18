import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { QuestionTypes } from "@models/Exam"
import { z } from "zod"
import optionSchema from "./option"

const questionSchema = z.object({
	type: z.enum(Object.keys(QuestionTypes) as [keyof typeof QuestionTypes], {
		invalid_type_error: "Tipo da pergunta inválido",
		required_error: "O tipo da pergunta é obrigatório"
	}),
	text: z.string({
		invalid_type_error: "Texto da pergunta inválido",
		required_error: "O texto da pergunta é obrigatório"
	})
		.trim()
		.min(ExamFormValidation.questionTextMinLength, `A pergunta da questão deve ter no mínimo ${ExamFormValidation.questionTextMinLength} caracteres`)
		.max(ExamFormValidation.questionTextMaxLength, `A pergunta da questão deve ter no máximo ${ExamFormValidation.questionTextMaxLength} caracteres`)
		.regex(new RegExp(GenericFormValidation.validDescriptionPattern), "A pergunta da questão contém caracteres inválidos"),
	options: z.array(optionSchema)
		.min(ExamFormValidation.minOptionsNumber, `As questões de múltipla escolha devem possuir no mínimo ${ExamFormValidation.minOptionsNumber} opções`)
		.max(ExamFormValidation.maxOptionsNumber, `As questões de múltipla escolha devem possuir no máximo ${ExamFormValidation.maxOptionsNumber} opções`)
		.optional(),
	required: z.boolean({
		invalid_type_error: "Valor inválido para o campo 'Questão obrigatória'",
		required_error: "O campo 'Questão obrigatória' é obrigatório"
	}),
	correct_answer: z.number({
		invalid_type_error: "O índice da resposta correta não é válido",
		required_error: "O índice da resposta correta é obrigatório"
	}).optional()
})

export default questionSchema
