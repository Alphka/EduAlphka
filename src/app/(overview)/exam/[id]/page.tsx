import type { PageProps } from "@typings/index"
import type { Metadata } from "next"
import type { IExam } from "@models/typings/Exam"
import type { Types } from "mongoose"
import { notFound, redirect, RedirectType } from "next/navigation"
import { Exam, StartedExam, Submit } from "@models"
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
	const [{ id }] = await Promise.all([
		params,
		await connectDatabase()
	])

	const [exam, user] = await Promise.all([
		Exam.findById(id)
			.select({
				owner: 1,
				title: 1,
				subject: 1,
				duration: 1,
				questions: 1,
				candidates: 1,
				description: 1
			})
			.lean<Pick<IExam,
				| "owner"
				| "title"
				| "subject"
				| "duration"
				| "questions"
				| "candidates"
				| "description"
			>>(),
		verifyAuthorization()
	])

	if(!exam) notFound()

	const candidates = exam.candidates.map(({ _id }) => _id.toString())

	if(user.accountType === "candidate"){
		if(!candidates.includes(user.id)) redirect(routes.accessDenied.pathname, RedirectType.replace)
		redirect(routes.exam.children.template.children.submit.pathname.replace("[id]", id), RedirectType.replace)
	}

	if(user.accountType !== "professor" || !(exam.owner as Types.ObjectId).equals(user.id)) redirect(routes.accessDenied.pathname, RedirectType.replace)

	const hasSubmit = await Submit.exists({ exam: id })
	const hasStartedBySomeone = hasSubmit || await StartedExam.exists({ exam: id })

	return (
		<ExamForm
			type="edit"
			canEdit={!hasSubmit || !hasStartedBySomeone}
			defaultValues={{
				exam: {
					title: exam.title,
					subject: exam.subject,
					duration: formatTimeDuration(exam.duration),
					description: exam.description
				},
				question: exam.questions.map(question => ({
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
