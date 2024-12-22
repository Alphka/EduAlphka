"use server"

import type { ExamMultipleChoiceQuestion } from "@models/typings/Exam"
import { startSession, type Types } from "mongoose"
import { ExamFormValidation } from "@constants/forms"
import { Answer, Exam, StartedExam, Submit } from "@models"
import getSessionUserData from "@helpers/getSessionUserData"
import connectDatabase from "@lib/connectDatabase"

interface DissertativeAnswer {
	content: string
}

interface MultipleChoiceAnswer {
	option: string
}

interface SubmitExamData {
	questions: ({ id: string } & (DissertativeAnswer | MultipleChoiceAnswer))[]
}

export default async function submitExam(id: string, data: SubmitExamData){
	if(!data?.questions) return { errors: ["As respostas do teste não foram encontradas"] }

	const { questions } = data

	try{
		await connectDatabase()

		const user = await getSessionUserData()

		if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }
		if(user.accountType !== "candidate") return { errors: ["Você não tem permissão para executar essa ação"] }

		if(!await StartedExam.exists({ exam: id, user: user.id })) return { errors: ["Você ainda não iniciou esse teste"] }
		if(await Submit.exists({ exam: id, user: user.id })) return { errors: ["Você já respondeu esse teste"] }

		const exam = await Exam.findById(id, { questions: 1 }).lean()

		if(!exam) return { errors: ["Teste não encontrado"] }
		if(exam.questions.length !== questions.length) return { errors: ["Quantidade de respostas inválida"] }

		const session = await startSession()

		const submit = new Submit({
			exam: id,
			user: user.id
		})

		const answers: InstanceType<typeof Answer>[] = []

		for(let index = 0, { length } = questions; index < length; index++){
			const examQuestion = exam.questions[index]
			const question = questions[index]
			const isDissertative = "content" in question
			const isMultipleChoice = "option" in question

			if(
				(isDissertative && isMultipleChoice) ||
				(!isDissertative && !isMultipleChoice) ||
				(isDissertative && examQuestion.type !== "dissertative") ||
				(isMultipleChoice && examQuestion.type !== "multiple_choice")
			){
				return { errors: ["Resposta inválida"] }
			}

			if(!(examQuestion._id as Types.ObjectId).equals(question.id)){
				return { errors: [`A questão de ID ${question.id} não foi encontrada no teste`] }
			}

			if(examQuestion.isRequired){
				if(
					(isDissertative && !question.content) ||
					(isMultipleChoice && !question.option)
				){
					return { errors: ["Há uma questão obrigatória que não foi respondida"] }
				}
			}

			const answer = new Answer({
				submit,
				question: examQuestion._id,
			})

			if(isMultipleChoice){
				const { type, options, correctAnswer } = examQuestion as ExamMultipleChoiceQuestion
				const { option } = question

				if(!options.some(({ _id }) => _id.equals(option))){
					return { errors: ["Uma opção selecionada não foi encontrada na questão"] }
				}

				const isCorrect = correctAnswer.equals(option)

				answers.push(Object.assign(answer, {
					type,
					option,
					isCorrect
				}))
			}else{
				const { content } = question

				if(content.length > ExamFormValidation.answerContentMaxLength){
					return { errors: [`A resposta deve ter no máximo ${ExamFormValidation.answerContentMaxLength} caracteres`] }
				}

				const { type } = examQuestion

				answers.push(Object.assign(answer, {
					type,
					content
				}))
			}
		}

		try{
			await session.withTransaction(() => Promise.all([
				Answer.bulkSave(answers, { session }),
				submit.save({ session })
			]))
		}finally{
			session.endSession()
		}
	}catch(error){
		if(typeof error === "string") return { errors: [error] }
		if(Array.isArray(error)) return { errors: error as string[] }

		console.error(error)

		return { errors: ["Falha ao enviar o teste"] }
	}
}
