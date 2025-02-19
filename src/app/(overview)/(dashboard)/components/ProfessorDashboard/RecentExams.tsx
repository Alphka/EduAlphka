import { Exam } from "@models"
import ExamList from "@components/Professor/ExamList"

interface RecentExamsProps {
	userId: string
	limit: number
}

export default async function RecentExams({ userId, limit }: RecentExamsProps){
	const exams = await Exam
		.find({ owner: userId }, {
			title: 1,
			subject: 1,
			duration: 1,
			createdAt: 1,
			updatedAt: 1,
			candidates: 1,
			description: 1,
			expiresAt: 1
		})
		.sort({ createdAt: "descending" })
		.limit(limit)

	return exams.length ? (
		<ExamList
			exams={exams}
			prefetch
		/>
	) : (
		<p className="text-md text-dark-200">
			Não há testes recentemente criados.
		</p>
	)
}
