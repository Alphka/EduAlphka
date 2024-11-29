import type { PagePropsWithLocale } from "@typings/index"
import type { Metadata } from "next"
import { getDictionary } from "@dictionaries"
import CreateExamForm from "./components/CreateExamForm"

export async function generateMetadata({ params }: PagePropsWithLocale){
	const { locale } = await params
	const { exam: { createForm: { title } } } = await getDictionary(locale)

	return {
		title,
		openGraph: {
			title
		}
	} as Metadata
}


export default async function CreateExam({ params }: PagePropsWithLocale){
	const { locale } = await params
	const dictionary = await getDictionary(locale)

	return (
		<CreateExamForm dictionary={dictionary} />
	)
}
