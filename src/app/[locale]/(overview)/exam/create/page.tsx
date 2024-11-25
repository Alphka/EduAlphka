import type { PagePropsWithLocale } from "@typings/index"
import type { Metadata } from "next"
import { getDictionary } from "@dictionaries"
import CreateExamForm from "./components/CreateExamForm"

export async function generateMetadata({ params }: PagePropsWithLocale){
	const { locale } = await params
	const { login: { title, description } } = await getDictionary(locale)

	return {
		title,
		description,
		openGraph: {
			title,
			description
		}
	} as Metadata
}


export default async function CreateExam({ params }: PagePropsWithLocale){
	const { locale } = await params
	const dictionary = await getDictionary(locale)

	return (
		<main>
			<CreateExamForm dictionary={dictionary} />
		</main>
	)
}
