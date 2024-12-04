import type { Metadata } from "next"
import { MdAddCircleOutline } from "react-icons/md"
import { Button, Group, Stack, Title } from "@mantine/core"
import ExamList from "./components/ExamList"
import routes from "@app/routes"
import Link from "next/link"

const title = routes.homepage.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default function Homepage(){
	return (
		<Stack gap="2xl">
			<Stack gap="lg">
				<Group
					component="header"
					justify="space-between"
					gap="md"
				>
					<Title
						order={1}
						fz="4xl"
					>
						Testes criados recentemente
					</Title>

					<Button
						href={routes.exam.children.create.pathname}
						variant="filled"
						component={Link}
						leftSection={<MdAddCircleOutline className="text-lg" />}
					>
						Criar teste
					</Button>
				</Group>

				<ExamList />
			</Stack>
		</Stack>
	)
}
