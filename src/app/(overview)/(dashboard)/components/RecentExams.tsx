import { Exam } from "@models"
import getSessionUser from "@helpers/getSessionUser"
import ExamList from "../../components/ExamList"

interface RecentExamsProps {
	limit: number
}

export default async function RecentExams({ limit }: RecentExamsProps){
	const date = new Date

	date.setDate(date.getDate() - 15)

	const user = (await getSessionUser())!

	const exams = await Exam
		.find({
			owner: user.id,
			createdAt: {
				$gte: date
			}
		}, {
			title: 1,
			subject: 1,
			description: 1,
			candidates: 1,
			createdAt: 1,
			updatedAt: 1
		})
		.sort({ createdAt: -1 })
		.limit(limit)

	return (
		<ExamList exams={exams} />
	)
}
