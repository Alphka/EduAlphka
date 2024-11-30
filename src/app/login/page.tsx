import type { Metadata } from "next"
import { APPLICATION_NAME } from "@constants/index"
import LoginForm from "./components/LoginForm"
import routes from "@app/routes"

const title = routes.register.title
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
	return (
		<main className="flex flex-col items-center justify-center py-12 min-h-dvh">
			<LoginForm />
		</main>
	)
}
