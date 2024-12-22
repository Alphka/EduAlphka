import type getSessionUserData from "@helpers/getSessionUserData"
import { MdAddCircleOutline } from "react-icons/md"
import { Suspense } from "react"
import { Button } from "@mantine/core"
import ExamListSkeleton from "../ExamListSkeleton"
import RecentExams from "./RecentExams"
import routes from "@app/routes"
import Link from "next/link"

export interface ProfessorDashboardProps {
	recentExamsLimit: number
	user: NonNullable<Awaited<ReturnType<typeof getSessionUserData>>>
}

export default function ProfessorDashboard({ user, recentExamsLimit }: ProfessorDashboardProps){
	return <>
		<div className="flex flex-col gap-lg">
			<header className="flex justify-between gap-md">
				<h1 className="flex-grow text-h3 font-bold">
					Testes criados recentemente
				</h1>

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

			<Suspense fallback={<ExamListSkeleton limit={recentExamsLimit / 2} />}>
				<RecentExams
					user={user}
					limit={recentExamsLimit}
				/>
			</Suspense>
		</div>
	</>
}
