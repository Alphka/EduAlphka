import type { CandidateDashboardProps } from "."
import type { HydratedDocument } from "mongoose"
import type { IUser } from "@models/typings/User"
import { Exam } from "@models"
import ExamList from "../../../components/Candidate/ExamList"

export interface ParticipatingExamsProps extends Pick<CandidateDashboardProps, "user"> {}

export default async function ParticipatingExams({ user }: ParticipatingExamsProps){
	const exams = await Exam
		.find({
			candidates: user.id
		}, {
			id: 1,
			owner: 1,
			title: 1,
			subject: 1,
			duration: 1,
			description: 1,
			questions: 1,
			createdAt: 1,
			updatedAt: 1
		})
		.sort({ createdAt: -1, updatedAt: -1 })
		.populate<{ owner: HydratedDocument<IUser> }>("owner")

	return exams.length ? (
		<ExamList
			user={user}
			exams={exams}
		/>
	) : (
		<p className="text-md text-dark-200">
			Você não está participando de nenhum teste.
		</p>
	)
}
