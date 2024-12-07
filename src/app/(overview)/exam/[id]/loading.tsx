import type { Metadata } from "next"
import ExamForm from "../components/ExamForm"
import routes from "@app/routes"

const title = routes.exam.children.template.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default function EditExamPageSkeleton(){
	return (
		<ExamForm
			type="edit"
			loading
		/>
	)
}
