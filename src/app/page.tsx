import type { Metadata } from "next"

export interface PageProps {
	params: {}
	searchParams: {
		[key: string]: string | string[] | undefined
	}
}

const title = "Página inicial"

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default async function Homepage(){
	return (
		<p>Hello World!</p>
	)
}
