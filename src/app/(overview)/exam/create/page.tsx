import type { Metadata } from "next"
import verifyAuthorization from "@helpers/verifyAuthorization"
import ExamForm from "../components/ExamForm"
import routes from "@app/routes"

const title = routes.exam.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default async function CreateExamPage(){
	await verifyAuthorization({ accountType: "professor" })

	return (
		<ExamForm />
	)
}
