import type { Metadata } from "next"
import verifyAuthorization from "@helpers/verifyAuthorization"
import ProfessorDashboard from "./components/ProfessorDashboard"
import CandidateDashboard from "./components/CandidateDashboard"
import routes from "@app/routes"

const title = routes.homepage.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default async function Homepage(){
	const user = await verifyAuthorization()

	return (
		<div className="flex flex-col gap-2xl">
			{user.accountType === "professor" ? (
				<ProfessorDashboard
					userId={user.id}
					recentExamsLimit={6}
				/>
			) : (
				<CandidateDashboard
					userId={user.id}
				/>
			)}
		</div>
	)
}
