import type { HydratedDocument } from "mongoose"
import type { IExam } from "@models/typings/Exam"
import type { z } from "zod"
import type getUserByToken from "@helpers/getUserByToken"
import { Exam } from "@models"
import getDurationMinutes from "@helpers/getDurationMinutes"
import examSchema from "@app/schemas/exam"

type TUser = Awaited<ReturnType<typeof getUserByToken>>
type TExam = HydratedDocument<IExam> | null
type TExamData = z.infer<typeof examSchema>

/** @throws {string | string[]} */
function createOrEditExam(user: TUser, examData: TExamData, exam?: TExam){
	const validatedFields = examSchema.safeParse(examData)

	if(!validatedFields.success){
		throw validatedFields.error.errors.map(error => error.message)
	}

	if(user?.accountType !== "professor" || (exam && !exam.owner._id.equals(user.id))) throw "Acesso negado"
	if(exam === null) throw "Teste não encontrado"
	if(!examData.questions.length) throw "O teste deve possuir pelo menos uma questão"
	if(!examData.questions.filter(({ required }) => required).length) throw "O teste deve possuir pelo menos uma questão obrigatória"

	const currentDate = new Date()

	currentDate.setHours(currentDate.getHours(), currentDate.getMinutes(), 0, 0)

	if(exam
		? exam.startsAt?.getTime() !== examData.startsAt?.getTime() && examData.startsAt && examData.startsAt < currentDate
		: examData.startsAt && examData.startsAt < currentDate
	){
		throw "A data de início do teste deve ser maior que a data atual"
	}

	if(examData.expiresAt){
		const expirationDate = examData.expiresAt.getTime()

		if(exam
			? exam.expiresAt?.getTime() !== expirationDate && expirationDate < currentDate.getTime()
			: expirationDate < currentDate.getTime()
		){
			throw "A data de término do teste deve ser maior que a data atual"
		}

		if(examData.startsAt){
			const startDate = examData.startsAt.getTime()

			if(expirationDate <= startDate){
				throw "A data de término do teste deve ser maior que a data de início do teste"
			}

			if(expirationDate < startDate + getDurationMinutes(examData.duration) * 60 * 1000){
				throw `A data de término deve ser suficiente para a realização do teste (${examData.duration})`
			}
		}
	}

	if(exam){
		exam.updatedAt = new Date
	}else{
		exam = new Exam({
			owner: user.id,
			candidates: []
		})
	}

	Object.assign(exam, {
		...validatedFields.data,
		duration: getDurationMinutes(validatedFields.data.duration),
		questions: validatedFields.data.questions.map(({ type, text, options, correct_answer, required }, questionIndex) => {
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

	validatedFields.data.questions.forEach((question, index) => {
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
