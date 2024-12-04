"use server"

import type { HydratedDocument } from "mongoose"
import type { TQuestionOption } from "@models/typings/Exam"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Exam } from "@models"
import getDurationMinutes from "@helpers/getDurationMinutes"
import getSessionUserData from "@helpers/getSessionUserData"
import connectDatabase from "@lib/connectDatabase"
import routes from "@app/routes"

export interface ExamData {
	title: string
	description: string
	subject?: string
	/** HH:MM */
	duration: string
}

export interface QuestionData {
	type: string
	text: string
	option?: {
		text: string
	}[]
	/** Option's index */
	correct_answer?: number
}

export default async function createExam({
	title,
	description,
	subject,
	duration
}: ExamData, questions: QuestionData[]){
	await connectDatabase()

	const user = await getSessionUserData()

	if(!user || user.accountType !== "professor") return { errors: ["Acesso negado"] }

	const exam = new Exam({
		owner: user.id,
		title,
		description,
		subject,
		duration: getDurationMinutes(duration),
		questions: questions.map(({ type, text, option: options/*, isRequired */ }) => {
			switch(type){
				case "dissertative":
					return {
						type,
						text,
						// isRequired
					}
				case "multiple_choice":
					if(!options) return { errors: ["As questões de múltipla escolha devem possuir opções definidas"] }

					return {
						type,
						text,
						options,
						// isRequired
					}
				default:
					return { errors: ["Tipo de questão inválido: " + type] }
			}
		}),
		candidates: []
	})

	for(let index = 0, { length } = questions; index < length; index++){
		const examQuestion = exam.questions[index]
		const question = questions[index]

		if(examQuestion.type !== "multiple_choice") continue

		examQuestion.correctAnswer = (examQuestion.options as HydratedDocument<TQuestionOption>[])[question.correct_answer!]._id
		examQuestion.isRequired = true
	}

	await exam.save()

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.pathname)
	// revalidatePath(routes.exam_editar_template.pathname)
	// TODO: Redirect to routes.exam_editar_template.pathname
	redirect(routes.exam.pathname)

	// TODO: Add expiresAt input in front-end
	// expiresAt?: Date
}
