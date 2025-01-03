import type { PageProps } from "@typings/index"
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

export default async function EditExamPageSkeleton({ params }: PageProps){
	const { id } = await params

	return (
		<ExamForm
			type="edit"
			examId={id}
			loading
		/>
	)
}
