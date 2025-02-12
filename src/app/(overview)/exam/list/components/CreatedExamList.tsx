import { Exam } from "@models"
import ExamList from "@app/(overview)/components/Professor/ExamList"

interface CreatedExamListProps {
	userId: string
}

export default async function CreatedExamList({ userId }: CreatedExamListProps){
	const exams = await Exam
		.find({
			owner: userId
		}, {
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

	return exams.length ? (
		<ExamList exams={exams} />
	) : (
		<p className="text-md text-dark-200">
			Você ainda não criou nenhum teste.
		</p>
	)
}
