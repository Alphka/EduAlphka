import type { PageProps } from "@typings/index"
import type { Metadata } from "next"
import type { Types } from "mongoose"
import { Exam, StartedExam, Submit } from "@models"
import { notFound } from "next/navigation"
import verifyAuthorization from "@helpers/verifyAuthorization"
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
	await connectDatabase()

	const { id } = await params

	const [exam] = await Promise.all([
		Exam.findById(id)
			.select({
				title: 1,
				subject: 1,
				duration: 1,
				questions: 1,
				description: 1
			})
			.lean<InstanceType<typeof Exam>>(),
		verifyAuthorization({ accountType: "professor" })
	])

	if(!exam) notFound()

	const {
		subject,
		duration,
		questions,
		description
	} = exam

	const hasSubmit = await Submit.exists({ exam: id })
	const hasStartedBySomeone = hasSubmit || await StartedExam.exists({ exam: id })

	return (
		<ExamForm
			type="edit"
			canEdit={!hasSubmit || !hasStartedBySomeone}
			defaultValues={{
				exam: {
					title: exam.title,
					subject,
					duration: formatTimeDuration(duration),
					description
				},
				question: questions.map(question => ({
					text: question.text,
					required: question.isRequired,
					question_type: question.type,
					...(question.type === "multiple_choice" ? {
						option: question.options.map(({ text }) => ({ text })),
						correct_answer: question.options.findIndex(({ _id }) => _id.equals(question.correctAnswer as Types.ObjectId))
					} : undefined)
				}))
			}}
		/>
	)
}
