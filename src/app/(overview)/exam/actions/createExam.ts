"use server"

import type { HydratedDocument } from "mongoose"
import type { TQuestionOption } from "@models/typings/Exam"
import type { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Exam } from "@models"
import getDurationMinutes from "@helpers/getDurationMinutes"
import getSessionUserData from "@helpers/getSessionUserData"
import examSchema from "../schemas/exam"
import routes from "@app/routes"

export default async function createExam(examData: z.infer<typeof examSchema>){
	const validatedFields = examSchema.safeParse(examData)

	if(!validatedFields.success){
		return {
			errors: validatedFields.error.errors.map(error => error.message)
		}
	}

	const user = await getSessionUserData()

	if(user?.accountType !== "professor") return { errors: ["Acesso negado"] }

	const {
		title,
		subject,
		duration,
		questions,
		description
	} = validatedFields.data

	const exam = new Exam({
		owner: user.id,
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
	revalidatePath(routes.exam.children.template.pathname, "page")
	// revalidatePath(routes.exam.children.edit.template.pathname, "page")
	redirect(routes.homepage.pathname)

	// TODO: Add expiresAt input in front-end
	// expiresAt?: Date
}
