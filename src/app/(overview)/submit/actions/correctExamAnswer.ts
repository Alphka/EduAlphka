"use server"

import type { HydratedDocument } from "mongoose"
import type { IAnswer } from "@models/typings/Answer"
import type { ISubmit } from "@models/typings/Submit"
import type { IExam } from "@models/typings/Exam"
import { ExamFormValidation } from "@constants/forms"
import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"
import { Answer } from "@models"
import connectDatabase from "@lib/connectDatabase"
import routes from "@app/routes"

export default async function correctExamAnswer(submitId: string, answerId: string, isCorrect: boolean, feedback?: string){
	await connectDatabase()

	const answer = await Answer
		.findById<HydratedDocument<Pick<IAnswer,
			| "_id"
			| "type"
			| "submit"
			| "isCorrect"
			| "feedback"
			| "updatedAt"
		>>>(answerId)
		.populate<{
			submit: HydratedDocument<Pick<ISubmit, "_id"> & {
				exam: HydratedDocument<Pick<IExam, "_id" | "questions">>
			}>
		}>({
			path: "submit",
			select: "exam",
			populate: {
				path: "exam",
				select: "questions"
			}
		})
		.orFail(notFound)

	if(!answer.submit._id.equals(submitId)) notFound()

	if(answer.type !== "dissertative"){
		return { errors: ["Não é possível corrigir esse tipo de resposta"] }
	}

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

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.submit.children.template.pathname.replace("[id]", submitId))
}
