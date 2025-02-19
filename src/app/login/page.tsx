import type { Metadata } from "next"
import { APPLICATION_NAME } from "@constants"
import getRequestURL from "@helpers/getRequestURL"
import LoginForm from "./components/LoginForm"
import routes from "@app/routes"

const title = routes.login.title
const description = `Entre ou registre-se na plataforma ${APPLICATION_NAME}` as const

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		title,
		description
	}
}

export default async function LoginPage(){
	const url = await getRequestURL()
	const redirectURL = url && new URL(url).searchParams.get("redirect") || undefined

	return (
		<main className="flex flex-col items-center justify-center p-8 xs:p-5xl min-h-dvh">
			<LoginForm redirectURL={redirectURL} />
		</main>
	)
}
