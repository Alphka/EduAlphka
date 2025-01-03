import type { PageProps } from "@typings/index"
import type { Metadata } from "next"
import type { IExam } from "@models/typings/Exam"
import { notFound, redirect, RedirectType } from "next/navigation"
import { Types } from "mongoose"
import { Exam } from "@models"
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
		connectDatabase()
	])

	if(!Types.ObjectId.isValid(id)) notFound()

	const [exam, user] = await Promise.all([
		Exam.findById(id, {
				owner: 1,
				title: 1,
				subject: 1,
				duration: 1,
				questions: 1,
				candidates: 1,
				description: 1
			})
			.lean<Pick<IExam,
				| "_id"
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

	if(user.accountType !== "professor" || !exam.owner._id.equals(user.id)) redirect(routes.accessDenied.pathname, RedirectType.replace)

	const { hasSubmit, hasStartedBySomeone } = await Exam.aggregate<{
		hasSubmit: boolean
		hasStartedBySomeone: boolean
	}>([
		{
			$match: {
				_id: exam._id
			}
		},
		{
			$lookup: {
				from: "submits",
				localField: "_id",
				foreignField: "exam",
				as: "submits"
			}
		},
		{
			$lookup: {
				from: "startedexams",
				localField: "_id",
				foreignField: "exam",
				as: "startedExams"
			}
		},
		{
			$project: {
				hasSubmit: { $gt: [{ $size: "$submits" }, 0] },
				hasStartedBySomeone: { $gt: [{ $size: "$startedExams" }, 0] }
			}
		}
	]).then(result => result[0] || { hasSubmit: false, hasStartedBySomeone: false })

	return (
		<ExamForm
			type="edit"
			examId={id}
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
						correct_answer: question.options.findIndex(({ _id }) => _id.equals(question.correctAnswer))
					} : undefined)
				}))
			}}
		/>
	)
}
