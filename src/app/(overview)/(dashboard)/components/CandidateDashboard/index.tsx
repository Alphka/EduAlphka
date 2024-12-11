import { Button, Text, Title } from "@mantine/core"
import { MdAddCircleOutline } from "react-icons/md"
import { Exam } from "@models"
import verifyAuthorization from "@helpers/verifyAuthorization"
import ExamList from "../../../components/ExamList"
import routes from "@app/routes"
import Link from "next/link"

interface CandidateDashboardProps {
	user: Awaited<ReturnType<typeof verifyAuthorization>>
}

export default async function CandidateDashboard({ user }: CandidateDashboardProps){
	const participatingExams = await Exam
		.find({ candidates: user.id })
		.lean<InstanceType<typeof Exam>[]>()

	// TODO: Create another version of the ExamCard component for candidates
	// TODO: Change exam URL - Include /submit
	// TODO: Add new details (professor's name, total grade, remaining time, etc.)
	// TODO: Move this to another file to insert new sections (active, pending correction, expired, etc.)

	return <>
		<div className="flex flex-col gap-lg">
			<header className="flex justify-between gap-md">
				<Title
					order={1}
					fz="4xl"
				>
					Testes em que você está participando
				</Title>

				<Button
					className="flex-shrink-0"
					href={routes.exam.children.create.pathname}
					variant="filled"
					component={Link}
					leftSection={<MdAddCircleOutline className="text-lg" />}
				>
					Criar teste
				</Button>
			</header>

			{participatingExams.length ? (
				<ExamList exams={participatingExams} />
			) : (
				<Text size="md" c="dimmed">
					Não há testes recentemente criados.
				</Text>
			)}
		</div>
	</>
}
