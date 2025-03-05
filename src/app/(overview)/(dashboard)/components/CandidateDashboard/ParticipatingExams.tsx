import type { CandidateDashboardProps } from "."
import type { HydratedDocument } from "mongoose"
import type { IUser } from "@models/typings/User"
import { Exam } from "@models"
import ExamList from "@components/Candidate/ExamList"

export interface ParticipatingExamsProps extends Pick<CandidateDashboardProps, "userId" | "recentExamsLimit"> {}

export default async function ParticipatingExams({ userId/*, recentExamsLimit */ }: ParticipatingExamsProps){
	const exams = await Exam
		.find({ candidates: userId }, {
			id: 1,
			owner: 1,
			title: 1,
			subject: 1,
			duration: 1,
			description: 1,
			questions: 1,
			createdAt: 1,
			updatedAt: 1,
			expiresAt: 1
		}, {
			sort: { createdAt: "descending" },
			// limit: recentExamsLimit
		})
		.populate<{
			owner: HydratedDocument<Pick<IUser, "name" | "username">>
		}>("owner", {
			_id: 0,
			name: 1,
			username: 1
		})

	return exams.length ? (
		<ExamList
			userId={userId}
			exams={exams}
		/>
	) : (
		<p className="text-md text-dark-200">
			Você não está participando de nenhum teste.
		</p>
	)
}
