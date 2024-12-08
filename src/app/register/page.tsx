import type { Metadata } from "next"
import { APPLICATION_NAME } from "@constants/index"
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

export default function RegisterPage(){
	return (
		<main className="flex flex-col items-center justify-center p-5xl min-h-dvh">
			<RegisterForm />
		</main>
	)
}
