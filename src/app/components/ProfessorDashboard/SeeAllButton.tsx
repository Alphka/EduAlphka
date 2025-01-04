import { Button } from "@mantine/core"
import { Exam } from "@models"
import routes from "@app/routes"
import Link from "next/link"

interface SeeAllButtonProps {
	userId: string
}

export default async function SeeAllButton({ userId }: SeeAllButtonProps){
	const hasCreatedExam = !!(await Exam.exists({ owner: userId }))

	return hasCreatedExam && (
		<Button
			className="self-center"
			variant="light"
			component={Link}
			href={routes.exam.children.list.pathname}
		>
			Ver todos
		</Button>
	)
}
