import { Text } from "@mantine/core"
import { Exam } from "@models"
import getSessionUserData from "@helpers/getSessionUserData"
import ExamList from "../../components/ExamList"

interface RecentExamsProps {
	limit: number
}

export default async function RecentExams({ limit }: RecentExamsProps){
	const date = new Date

	date.setDate(date.getDate() - 15)

	const user = (await getSessionUserData())!

	const exams = await Exam
		.find({
			owner: user.id,
			createdAt: {
				$gte: date
			}
		}, {
			title: 1,
			subject: 1,
			duration: 1,
			createdAt: 1,
			updatedAt: 1,
			candidates: 1,
			description: 1
		})
		.sort({ createdAt: -1 })
		.limit(limit)

	return exams.length ? (
		<ExamList exams={exams} />
	) : (
		<Text size="md" c="dimmed">
			Não há testes recentemente criados.
		</Text>
	)
}
