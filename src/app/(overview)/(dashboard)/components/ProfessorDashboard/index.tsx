import { MdAddCircleOutline } from "react-icons/md"
import { Suspense } from "react"
import { Button } from "@mantine/core"
import ExamListSkeleton from "@components/ExamListSkeleton"
import SeeAllButton from "./SeeAllButton"
import RecentExams from "./RecentExams"
import routes from "@app/routes"
import Link from "next/link"

interface ProfessorDashboardProps {
	recentExamsLimit: number
	userId: string
}

export default function ProfessorDashboard({ userId, recentExamsLimit }: ProfessorDashboardProps){
	return (
		<div className="flex flex-col gap-lg">
			<header className="flex justify-end flex-wrap-reverse gap-md">
				<h1 className="flex-grow text-h4 xs:text-h3 font-bold">
					Testes criados recentemente
				</h1>

				<Button
					className="flex-shrink-0"
					href={routes.exam.children.create.pathname}
					variant="filled"
					component={Link}
					leftSection={<MdAddCircleOutline className="max-xs:hidden text-lg" />}
				>
					Criar teste
				</Button>
			</header>

			<Suspense fallback={<ExamListSkeleton limit={recentExamsLimit / 2} />}>
				<RecentExams
					userId={userId}
					limit={recentExamsLimit}
				/>
			</Suspense>

			<SeeAllButton userId={userId} />
		</div>
	)
}
