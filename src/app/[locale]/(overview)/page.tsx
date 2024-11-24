import type { PagePropsWithLocale } from "@typings/index"
import type { Metadata } from "next"
import { getDictionary } from "../dictionaries"

export async function generateMetadata({ params }: PagePropsWithLocale){
	const { locale } = await params
	const { homepage: { title } } = await getDictionary(locale)

	return {
		title,
		openGraph: {
			title
		}
	} as Metadata
}

export default async function Homepage({ params }: PagePropsWithLocale){
	const { locale } = await params
	const dictionary = await getDictionary(locale)

	return (
		<main>
			<p>{dictionary.homepage.title}</p>
		</main>
	)
}
