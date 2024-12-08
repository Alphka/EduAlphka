import type { Metadata } from "next"
import { MdAddCircleOutline } from "react-icons/md"
import { Button, Title } from "@mantine/core"
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
		<div className="flex flex-col gap-2xl">
			<div className="flex flex-col gap-lg">
				<header className="flex justify-between gap-md">
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
				</header>

				<Suspense fallback={<ExamListSkeleton limit={recentExamsLimit / 2} />}>
					<RecentExams limit={recentExamsLimit} />
				</Suspense>
			</div>
		</div>
	)
}
