import type { PagePropsWithLocale } from "@typings/index"
import type { Metadata } from "next"
import { MdAddCircleOutline } from "react-icons/md"
import { getDictionary } from "../dictionaries"
import { Button } from "@mantine/core"
import getRouteWithLocale from "@helpers/getRouteWithLocale"
import routes from "@app/routes"
import Link from "next/link"

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
	)
}
