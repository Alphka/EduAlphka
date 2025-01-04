import type { z } from "zod"
import type getUserByToken from "@helpers/getUserByToken"
import { Exam } from "@models"
import getDurationMinutes from "@helpers/getDurationMinutes"
import examSchema from "@app/schemas/exam"

type TUser = Awaited<ReturnType<typeof getUserByToken>>
type TExamData = z.infer<typeof examSchema>
type TExam = InstanceType<typeof Exam> | null

/** @throws {string | string[]} */
function createOrEditExam(user: TUser, examData: TExamData, exam?: TExam){
	const validatedFields = examSchema.safeParse(examData)

	if(!validatedFields.success){
		throw validatedFields.error.errors.map(error => error.message)
	}

	if(user?.accountType !== "professor" || (exam && !exam.owner._id.equals(user.id))) throw "Acesso negado"
	if(exam === null) throw "Teste não encontrado"

	const {
		title,
		subject,
		duration,
		questions,
		description
	} = validatedFields.data

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
					if(!options?.length) throw "As questões de múltipla escolha devem possuir opções definidas"
					if(typeof correct_answer !== "number") throw "As questões de múltipla escolha devem possuir uma resposta correta"
					if(correct_answer < 0 || correct_answer >= options.length) throw `A resposta correta da questão ${questionIndex + 1} não é válida`

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
	})

	return exam
}

/** @throws {string | string[]} */
export function createExam(user: TUser, examData: TExamData){
	return createOrEditExam(user, examData)
}

/** @throws {string | string[]} */
export default function editExam(user: TUser, exam: NonNullable<TExam>, examData: TExamData){
	return createOrEditExam(user, examData, exam)
}
