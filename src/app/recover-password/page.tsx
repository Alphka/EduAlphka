import type { Metadata } from "next"
import PasswordRecoveryForm from "./components/PasswordRecoveryForm"
import routes from "@app/routes"

const title = routes.recoverPassword.title
const description = "Formuário para recuperação de senha"

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		title,
		description
	}
}

export default function PasswordRecoveryPage(){
	return (
		<main className="flex flex-col items-center justify-center p-5xl min-h-dvh">
			<PasswordRecoveryForm />
		</main>
	)
}
