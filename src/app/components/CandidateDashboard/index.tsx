import { Suspense } from "react"
import ParticipatingExams from "./ParticipatingExams"
import ExamListSkeleton from "../ExamListSkeleton"

export interface CandidateDashboardProps {
	userId: string
}

export default async function CandidateDashboard({ userId }: CandidateDashboardProps){
	return <>
		<div className="flex flex-col gap-lg">
			<header className="flex justify-end flex-wrap gap-md">
				<h1 className="flex-grow text-h4 font-bold">
					Testes em que você está participando
				</h1>
			</header>

			<Suspense fallback={<ExamListSkeleton limit={3} />}>
				<ParticipatingExams userId={userId} />
			</Suspense>
		</div>
	</>
}
