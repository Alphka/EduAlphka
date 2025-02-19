import type { Metadata } from "next"
import { APPLICATION_NAME } from "@constants"
import getRequestURL from "@helpers/getRequestURL"
import RegisterForm from "./components/RegisterForm"
import routes from "@app/routes"

const title = routes.register.title
const description = `Registre-se na plataforma ${APPLICATION_NAME}` as const

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		title,
		description
	}
}

export default async function RegisterPage(){
	const url = await getRequestURL()
	const redirectURL = url && new URL(url).searchParams.get("redirect") || undefined

	return (
		<main className="flex flex-col items-center justify-center p-8 xs:p-5xl min-h-dvh">
			<RegisterForm redirectURL={redirectURL} />
		</main>
	)
}
