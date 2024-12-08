import type { Metadata } from "next"
import { APPLICATION_NAME } from "@constants/index"
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

export default function LoginPage(){
	return (
		<main className="flex flex-col items-center justify-center p-5xl min-h-dvh">
			<LoginForm />
		</main>
	)
}
