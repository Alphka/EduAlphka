"use client"

import { useParams } from "next/navigation"
import ExamForm from "../components/ExamForm"

export default async function EditExamPageSkeleton(){
	const { id } = useParams()

	return (
		<ExamForm
			type="edit"
			examId={id as string}
			loading
		/>
	)
}
