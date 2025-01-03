import type { IExamInvite } from "@models/typings/ExamInvite"
import { NextResponse, type NextRequest } from "next/server"
import { Types, type HydratedDocument } from "mongoose"
import { Exam, ExamInvite } from "@models"
import { notFound } from "next/navigation"
import verifyAuthorization from "@helpers/verifyAuthorization"
import connectDatabase from "@lib/connectDatabase"
import routes from "@app/routes"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ token: string }> }){
	const [{ token }] = await Promise.all([
		params,
		connectDatabase()
	])

	if(!Types.ObjectId.isValid(token)) notFound()

	const [user, examInvite] = await Promise.all([
		verifyAuthorization(),
		ExamInvite.findOne<HydratedDocument<Pick<IExamInvite, "_id"> & { exam: Types.ObjectId }>>({ token }, {
			exam: 1
		})
	])

	if(!examInvite) notFound()

	const exam = await Exam.findById(examInvite.exam, {
		candidates: 1
	})

	if(!exam){
		console.error(
			"Exam from exam invite not found." +
			`\n\tToken: ${token}` +
			`\n\tUser: ${user.name} (${user.id}) - ${user.username}` +
			`\n\tExam ID: ${examInvite.exam}` +
			`\n\tExam invite ID: ${examInvite.id}`
		)

		await examInvite.deleteOne()
		notFound()
	}

	const isCandidate = user.accountType === "candidate"

	const examURL = (isCandidate
		? routes.exam.children.template.children.submit.pathname
		: routes.exam.children.template.pathname
	).replace("[id]", examInvite.exam.toString())

	const candidates = exam.candidates.map(candidate => candidate.toString())

	if(isCandidate && !candidates.includes(user.id)){
		exam.candidates.unshift(new Types.ObjectId(user.id))
		await exam.save()
	}

	return new NextResponse(examURL, {
		status: 302,
		statusText: "Found",
		headers: {
			Location: examURL,
			"Cache-Control": "no-store, max-age=0"
		}
	})
}

export const revalidate = 0
