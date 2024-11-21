import { getDictionary } from "./dictionaries"
import getLocale from "@helpers/getLocale"

export default async function NotFoundPage(){
	const locale = await getLocale()
	const { notFound: dictionary } = await getDictionary(locale)

	return (
		<main className="flex flex-col items-center justify-center min-h-dvh">
			<h1>{dictionary.title}</h1>
		</main>
	)
}
