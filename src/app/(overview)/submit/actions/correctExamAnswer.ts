"use server"

import { ExamFormValidation } from "@constants/forms"
import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"
import { Answer } from "@models"
import connectDatabase from "@lib/connectDatabase"
import routes from "@app/routes"

export default async function correctExamAnswer(submitId: string, answerId: string, isCorrect: boolean, feedback?: string){
	await connectDatabase()

	const answer = await Answer.findById(answerId)

	if(!answer?.submit._id.equals(submitId)) notFound()

	if(answer.type !== "dissertative"){
		return { errors: ["Não é possível corrigir esse tipo de resposta"] }
	}

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
	answer.updatedAt = new Date
	answer.markModified("updatedAt")

	await answer.save()

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.submit.children.template.pathname.replace("[id]", submitId))
}
