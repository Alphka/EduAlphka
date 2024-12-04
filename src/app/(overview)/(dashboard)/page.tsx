import type { Metadata } from "next"
import { Button, Group, Stack, Title } from "@mantine/core"
import { MdAddCircleOutline } from "react-icons/md"
import { Suspense } from "react"
import ExamListSkeleton from "./components/ExamListSkeleton"
import RecentExams from "./components/RecentExams"
import routes from "@app/routes"
import Link from "next/link"

const title = routes.homepage.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

const recentExamsLimit = 6

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

				<Suspense fallback={<ExamListSkeleton limit={recentExamsLimit / 2} />}>
					<RecentExams limit={recentExamsLimit} />
				</Suspense>
			</Stack>
		</Stack>
	)
}
