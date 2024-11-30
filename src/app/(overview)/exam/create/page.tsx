import type { Metadata } from "next"
import CreateExamForm from "./components/CreateExamForm"
import routes from "@app/routes"

const title = routes.exam.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default function CreateExam(){
	return (
		<CreateExamForm />
	)
}
