import type { z } from "zod"
import { Exam, type User } from "@models"
import getDurationMinutes from "@helpers/getDurationMinutes"
import examSchema from "@app/schemas/exam"

type TUser = Pick<InstanceType<typeof User>, "id" | "accountType"> | null
type TExamData = z.infer<typeof examSchema>
type TExam = InstanceType<typeof Exam> | null

/** @throws {string | string[]} */
function createOrEditExam(user: TUser, examData: TExamData, exam?: TExam){
	const validatedFields = examSchema.safeParse(examData)

	if(!validatedFields.success){
		throw validatedFields.error.errors.map(error => error.message)
	}

	if(user?.accountType !== "professor" || (exam && !exam.owner.equals(user.id))) throw "Acesso negado"
	if(exam === null) throw "Teste não encontrado"

	const { title, subject, description, duration, questions } = validatedFields.data

	if(exam){
		exam.updatedAt = new Date
	}else{
		exam = new Exam({
			owner: user.id,
			candidates: []
		})
	}

	Object.assign(exam, {
		title,
		subject,
		description,
		duration: getDurationMinutes(duration),
		questions: questions.map(({ type, text, options, correct_answer, required }, questionIndex) => {
			switch(type){
				case "dissertative":
					return {
						type,
						text,
						isRequired: required
					}
				case "multiple_choice":
					if(!options?.length) return { errors: ["As questões de múltipla escolha devem possuir opções definidas"] }
					if(typeof correct_answer !== "number") return { errors: ["As questões de múltipla escolha devem possuir uma resposta correta"] }
					if(correct_answer < 0 || correct_answer >= options.length) return { errors: [`A resposta correta da questão ${questionIndex + 1} não é válida`] }

					return {
						type,
						text,
						options,
						isRequired: required
					}
				default: throw "Tipo de questão inválido: " + type
			}
		})
	})

	questions.forEach((question, index) => {
		const examQuestion = exam.questions[index]

		if(examQuestion.type !== "multiple_choice") return

		examQuestion.correctAnswer = examQuestion.options[question.correct_answer!]._id
		examQuestion.isRequired = true
	})

	return exam
}

/** @throws {string | string[]} */
export function createExam(user: TUser, examData: TExamData){
	return createOrEditExam(user, examData)
}

/** @throws {string | string[]} */
export default function editExam(user: TUser, exam: TExam, examData: TExamData){
	return createOrEditExam(user, examData, exam)
}
