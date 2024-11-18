import type { Metadata } from "next"
import { APPLICATION_NAME } from "@app/constants"
import LoginForm from "./components/LoginForm"

const title = "Login"
const description = "Entre ou registre-se na plataforma " + APPLICATION_NAME

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
		<main className="flex flex-col items-center justify-center py-12 min-h-dvh">
			<LoginForm />
		</main>
	)
}
