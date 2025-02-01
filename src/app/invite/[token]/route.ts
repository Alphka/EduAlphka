import type { IExamInvite } from "@models/typings/ExamInvite"
import type { IExam } from "@models/typings/Exam"
import { NextResponse, type NextRequest } from "next/server"
import { Types, type HydratedDocument } from "mongoose"
import { redirect, RedirectType } from "next/navigation"
import { ExamInvite } from "@models"
import verifyAuthorization from "@helpers/verifyAuthorization"
import connectDatabase from "@lib/connectDatabase"
import routes from "@app/routes"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ token: string }> }){
	const [{ token }] = await Promise.all([
		params,
		connectDatabase()
	])

	const user = await verifyAuthorization()

	const examInvite = await ExamInvite
		.findOne<HydratedDocument<Pick<IExamInvite, "_id"> & {
			exam: HydratedDocument<Pick<IExam, "_id"> & {
				owner: Types.ObjectId
				candidates: Types.Array<Types.ObjectId>
				disallowedCandidates: Types.Array<Types.ObjectId>
			}>
		}>>({ token }, { exam: 1 })
		.populate("exam", {
			owner: 1,
			candidates: 1,
			disallowedCandidates: 1
		})

	if(!examInvite?.exam){
		if(examInvite && !examInvite.exam){
			console.error(
				"Exam from exam invite not found." +
				`\n\tToken: ${token}` +
				`\n\tUser: ${user.name} (${user.id}) - ${user.username}` +
				`\n\tExam invite ID: ${examInvite.id}`
			)

			await examInvite.deleteOne()
		}

		redirect("/not-found", RedirectType.replace)
	}

	const isCandidate = user.accountType === "candidate"
	const userId = new Types.ObjectId(user.id)

	if(isCandidate
		? examInvite.exam.disallowedCandidates.includes(userId)
		: !examInvite.exam.owner._id.equals(userId)
	){
		redirect(routes.accessDenied.pathname, RedirectType.replace)
	}

	if(isCandidate && !examInvite.exam.candidates.includes(userId)){
		examInvite.exam.candidates.unshift(userId)
		await examInvite.exam.save()
	}

	const examURL = (isCandidate
		? routes.exam.children.template.children.submit.pathname
		: routes.exam.children.template.pathname
	).replace("[id]", examInvite.exam.id)

	return new NextResponse(examURL, {
		status: 302,
		statusText: "Found",
		headers: {
			Location: examURL,
			"Cache-Control": "private, no-store, max-age=0"
		}
	})
}

export const revalidate = 0
