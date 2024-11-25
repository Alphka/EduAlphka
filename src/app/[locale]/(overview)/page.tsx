import type { PagePropsWithLocale } from "@typings/index"
import type { Metadata } from "next"
import { getDictionary } from "../dictionaries"
import { Button } from "@mantine/core"
import { MdAddCircleOutline } from "react-icons/md"
import Link from "next/link"
import routes from "@app/routes"
import getRouteWithLocale from "@helpers/getRouteWithLocale"

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
			<div className="flex justify-between">
				<p>{dictionary.homepage.title}</p>

				<Button
					href={getRouteWithLocale(routes.exam.children.create.pathname, locale)}
					variant="filled"
					component={Link}
					leftSection={<MdAddCircleOutline className="text-lg" />}
				>
					{dictionary.homepage.examButton.text}
				</Button>
			</div>
		</main>
	)
}
