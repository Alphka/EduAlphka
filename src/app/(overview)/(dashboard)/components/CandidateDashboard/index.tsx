import type getSessionUserData from "@helpers/getSessionUserData"
import { Suspense } from "react"
import { Title } from "@mantine/core"
import ParticipatingExams from "./ParticipatingExams"
import ExamListSkeleton from "../ExamListSkeleton"

export interface CandidateDashboardProps {
	user: NonNullable<Awaited<ReturnType<typeof getSessionUserData>>>
}

export default async function CandidateDashboard({ user }: CandidateDashboardProps){
	return <>
		<div className="flex flex-col gap-lg">
			<header className="flex justify-between gap-md">
				<Title
					order={1}
					fz="4xl"
				>
					Testes em que você está participando
				</Title>
			</header>

			<Suspense fallback={<ExamListSkeleton limit={3} />}>
				<ParticipatingExams user={user} />
			</Suspense>
		</div>
	</>
}
