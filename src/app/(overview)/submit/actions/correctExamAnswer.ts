"use server"

import type { ISubmit } from "@models/typings/Submit"
import type { IExam } from "@models/typings/Exam"
import { Types, type HydratedDocument } from "mongoose"
import { ExamFormValidation } from "@constants/forms"
import { revalidatePath } from "next/cache"
import { Answer } from "@models"
import getSessionUserData from "@helpers/getSessionUserData"
import routes from "@app/routes"

export default async function correctExamAnswer(answerId: string, isCorrect: boolean, feedback?: string){
	if(!Types.ObjectId.isValid(answerId)){
		return { errors: ["ID da resposta inválido"] }
	}

	const user = await getSessionUserData()

	if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }
	if(user.accountType !== "professor") return { errors: ["Você não tem permissão para executar essa ação"] }

	const answer = await Answer
		.findById(answerId, {
			type: 1,
			submit: 1,
			question: 1,
			feedback: 1,
			updatedAt: 1,
			isCorrect: 1
		})
		.populate<{
			submit: HydratedDocument<Pick<ISubmit, "_id"> & {
				exam: HydratedDocument<Pick<IExam, "_id" | "questions">> & {
					owner: Types.ObjectId
				}
			}>
		}>({
			path: "submit",
			select: "exam",
			populate: {
				path: "exam",
				select: "owner questions"
			}
		})

	if(!answer) return { errors: ["Resposta não encontrada"] }
	if(!answer.submit.exam.owner._id.equals(user.id)) return { errors: ["Você não tem permissão para executar essa ação"] }
	if(answer.type !== "dissertative") return { errors: ["Não é possível corrigir esse tipo de resposta"] }

	const examQuestion = answer.submit.exam.questions.find(question => question._id.equals(answer.question))

	if(!examQuestion) return { errors: ["Questão não encontrada no teste"] }
	if(!examQuestion.isRequired) return { errors: ["Essa questão não obrigatória, portanto não é avaliativa"] }

	if(feedback){
		if(feedback.length < ExamFormValidation.submitFeedbackMinLength){
			return { errors: [`O feedback deve ter no mínimo ${ExamFormValidation.submitFeedbackMinLength} caracteres`] }
		}

		if(feedback.length > ExamFormValidation.submitFeedbackMaxLength){
			return { errors: [`O feedback deve ter no máximo ${ExamFormValidation.submitFeedbackMaxLength} caracteres`] }
		}

		answer.feedback = feedback
	}

	answer.isCorrect = isCorrect

	if(answer.isModified()){
		answer.updatedAt = new Date
		answer.markModified("updatedAt")

		await answer.save()
	}

	revalidatePath(routes.submit.children.template.pathname.replace("[id]", answer.submit.id))
}
