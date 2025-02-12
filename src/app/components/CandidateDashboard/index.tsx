import { Suspense } from "react"
import ParticipatingExams from "./ParticipatingExams"
import ExamListSkeleton from "../ExamListSkeleton"

export interface CandidateDashboardProps {
	userId: string
	recentExamsLimit: number
}

export default async function CandidateDashboard({ userId, recentExamsLimit }: CandidateDashboardProps){
	return <>
		<div className="flex flex-col gap-lg">
			<header className="flex justify-end flex-wrap-reverse gap-md">
				<h1 className="flex-grow text-h4 font-bold">
					Testes em que você está participando
				</h1>
			</header>

			<Suspense fallback={<ExamListSkeleton limit={recentExamsLimit / 2} />}>
				<ParticipatingExams
					{...{
						userId,
						recentExamsLimit
					}}
				/>
			</Suspense>
		</div>
	</>
}
