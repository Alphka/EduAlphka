import type { PageProps } from "@typings/index"
import type { Metadata } from "next"
import type { Types } from "mongoose"
import { notFound } from "next/navigation"
import { Exam } from "@models"
import formatTimeDuration from "@helpers/formatTimeDuration"
import connectDatabase from "@lib/connectDatabase"
import ExamForm from "../components/ExamForm"
import routes from "@app/routes"

const title = routes.exam.children.template.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default async function EditExamPage({ params }: PageProps){
	const { id } = await params

	await connectDatabase()

	const exam = await Exam.findById(id).select({
		title: 1,
		subject: 1,
		duration: 1,
		questions: 1,
		description: 1
	})

	if(!exam) notFound()

	const {
		subject,
		duration,
		questions,
		description
	} = exam

	return (
		<ExamForm
			type="edit"
			defaultValues={{
				exam: {
					title: exam.title,
					subject,
					duration: formatTimeDuration(duration),
					description
				},
				question: questions.map(question => {
					question.correctAnswer
					return {
						text: question.text,
						required: question.isRequired,
						question_type: question.type,
						...(question.type === "multiple_choice" ? {
							option: question.options.map(({ text }) => ({ text })),
							correct_answer: question.options.findIndex(({ _id }) => _id.equals(question.correctAnswer as Types.ObjectId))
						} : undefined)
					}
				})
			}}
		/>
	)
}
