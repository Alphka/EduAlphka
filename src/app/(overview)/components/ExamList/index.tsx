import Container from "./container"
import ExamCard from "../ExamCard"
import Exam from "@models/Exam"
import getSessionUser from "@helpers/getSessionUser"

export default async function ExamList(){
	const date = new Date()

	date.setDate(date.getDate() - 15)

	const user = await getSessionUser()

	const exams = await Exam
		.find({
			owner: user,
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
		.limit(6)

	return (
		<Container>
			{exams.map(({ id, title, description, subject, candidates, createdAt, updatedAt }) => (
				<ExamCard
					active
					title={title}
					subject={subject}
					description={description}
					createdAt={createdAt as Date}
					updatedAt={updatedAt as Date | undefined}
					candidatesCount={candidates.length}
					key={id}
				/>
			))}
		</Container>
	)
}
