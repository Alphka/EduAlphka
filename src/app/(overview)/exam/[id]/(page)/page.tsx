import type { MixedExamQuestion } from "@models/typings/Exam"
import type { PageProps } from "@typings"
import type { Metadata } from "next"
import { notFound, redirect, RedirectType } from "next/navigation"
import { Exam, StartedExam } from "@models"
import { Types } from "mongoose"
import { pick } from "lodash"
import verifyAuthorization from "@helpers/verifyAuthorization"
import formatTimeDuration from "@helpers/formatTimeDuration"
import connectDatabase from "@lib/connectDatabase"
import ExamForm from "../../components/ExamForm"
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

	if(!Types.ObjectId.isValid(id)){
		notFound()
	}

	const [exam, user] = await Promise.all([
		Exam
			.findById(id, {
				owner: 1,
				title: 1,
				subject: 1,
				duration: 1,
				questions: 1,
				candidates: 1,
				description: 1,
				expiresAt: 1,
				startsAt: 1
			})
			.orFail(notFound),
		verifyAuthorization()
	])

	if(user.accountType === "candidate"){
		if(!exam.candidates.includes(new Types.ObjectId(user.id))) redirect(routes.accessDenied.pathname, RedirectType.replace)
		redirect(routes.exam.children.template.children.submit.pathname.replace("[id]", id), RedirectType.replace)
	}

	if(user.accountType !== "professor" || !exam.owner._id.equals(user.id)) redirect(routes.accessDenied.pathname, RedirectType.replace)

	const questions = exam.questions as Types.DocumentArray<
		MixedExamQuestion,
		Types.Subdocument<MixedExamQuestion, any, MixedExamQuestion> & MixedExamQuestion
	>

	return (
		<ExamForm
			type="edit"
			examId={id}
			canEdit={!(await StartedExam.exists({ exam }))}
			defaultValues={{
				exam: {
					...pick(exam, ["title", "subject", "description", "startsAt", "expiresAt"] as const),
					duration: formatTimeDuration(exam.duration)
				},
				question: questions.map(({ type, text, options, correctAnswer, isRequired }) => ({
					text: text,
					required: isRequired,
					question_type: type,
					...(type === "multiple_choice" ? {
						option: options.map(({ text }) => ({ text })),
						correct_answer: options.findIndex(({ _id }) => _id.equals(correctAnswer))
					} : undefined)
				}))
			}}
		/>
	)
}
