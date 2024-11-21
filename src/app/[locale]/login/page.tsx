import type { PagePropsWithLocale } from "@typings/index"
import type { Metadata } from "next"
import { getDictionary } from "../dictionaries"
import LoginForm from "./components/LoginForm"

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

export default async function LoginPage({ params }: PagePropsWithLocale){
	const { locale } = await params
	const { login: dictionary } = await getDictionary(locale)

	return (
		<main className="flex flex-col items-center justify-center py-12 min-h-dvh">
			<LoginForm dictionary={dictionary} />
		</main>
	)
}
