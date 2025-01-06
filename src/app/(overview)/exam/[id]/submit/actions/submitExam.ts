"use server"

import type { ExamMultipleChoiceQuestion, IExam } from "@models/typings/Exam"
import { Answer, Exam, Session, StartedExam, Submit } from "@models"
import { ExamFormValidation } from "@constants/forms"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import getSessionUserData from "@helpers/getSessionUserData"
import routes from "@app/routes"

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

	const questions = data.questions.map(question => {
		const { id } = question

		if("content" in question){
			const { content } = question
			return content.trim() ? { id, content } : { id }
		}else{
			const { option } = question
			return option.trim() ? { id, option } : { id }
		}
	})

	try{
		const user = await getSessionUserData()

		if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }
		if(user.accountType !== "candidate") return { errors: ["Você não tem permissão para executar essa ação"] }

		const [hasStartedExam, hasSubmittedExam] = await Promise.all([
			StartedExam.exists({ exam: id, user: user.id }),
			Submit.exists({ exam: id, user: user.id })
		])

		if(!hasStartedExam) return { errors: ["Você ainda não iniciou esse teste"] }
		if(hasSubmittedExam) return { errors: ["Você já respondeu esse teste"] }

		const exam = await Exam
			.findById(id, { questions: 1 })
			.lean<Pick<IExam, "_id" | "questions">>()

		if(!exam){
			return { errors: ["Teste não encontrado"] }
		}

		if(exam.questions.length !== questions.length){
			return { errors: ["A quantidade de respostas é diferente da quantidade de questões do teste"] }
		}

		const submit = new Submit({
			exam: id,
			user: user.id
		})

		const answers: InstanceType<typeof Answer>[] = []

		for(let index = 0, { length } = questions; index < length; index++){
			const examQuestion = exam.questions[index]
			const { isRequired } = examQuestion
			const question = questions[index]
			const isDissertative = "content" in question
			const isMultipleChoice = "option" in question

			if(
				(isDissertative && isMultipleChoice) ||
				(isDissertative && examQuestion.type !== "dissertative") ||
				(isMultipleChoice && examQuestion.type !== "multiple_choice")
			){
				return { errors: ["Há uma resposta inválida"] }
			}

			if(!examQuestion._id.equals(question.id)){
				return { errors: [`A questão de ID ${question.id} não foi encontrada no teste`] }
			}

			if(isRequired && (!isDissertative && !isMultipleChoice)){
				return { errors: ["Há uma questão obrigatória que não foi respondida"] }
			}

			const answer = new Answer({
				type: examQuestion.type,
				submit,
				question: examQuestion._id,
			})

			if(isMultipleChoice){
				const { options, correctAnswer } = examQuestion as ExamMultipleChoiceQuestion
				const { option: chosenOption } = question as MultipleChoiceAnswer

				if(!options.some(({ _id }) => _id.equals(chosenOption))){
					return { errors: ["Uma opção selecionada não foi encontrada na questão"] }
				}

				answers.push(Object.assign(answer, {
					option: chosenOption,
					isCorrect: isRequired ? correctAnswer.equals(chosenOption) : undefined
				}))
			}else if(isDissertative){
				const { content } = question as DissertativeAnswer

				if(content!.length < ExamFormValidation.answerContentMinLength){
					return { errors: [`A resposta deve ter no mínimo ${ExamFormValidation.answerContentMinLength} caracteres`] }
				}

				if(content && content.length > ExamFormValidation.answerContentMaxLength){
					return { errors: [`A resposta deve ter no máximo ${ExamFormValidation.answerContentMaxLength} caracteres`] }
				}

				answers.push(Object.assign(answer, { content }))
			}else{
				answers.push(answer)
			}
		}

		const [answersResult, submitResult] = await Promise.allSettled([
			Answer.bulkSave(answers),
			submit.save()
		])

		if(answersResult.status === "rejected" || submitResult.status === "rejected"){
			await Promise.allSettled([
				Answer.deleteMany({ submit: submit.id }),
				Session.deleteMany({ exam: id, user: user.id }),
				submit.deleteOne()
			])

			if(answersResult.status === "rejected") throw answersResult.reason
			if(submitResult.status === "rejected") throw submitResult.reason
		}
	}catch(error){
		if(typeof error === "string") return { errors: [error] }
		if(Array.isArray(error)) return { errors: error as string[] }

		console.error(error)

		return { errors: ["Falha ao enviar o teste"] }
	}

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", id))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", id))
	redirect(routes.homepage.pathname)
}
