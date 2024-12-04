import type { Metadata } from "next"
import { APPLICATION_NAME } from "@constants/index"
import { Stack } from "@mantine/core"
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
		<Stack
			p="5xl"
			align="center"
			justify="center"
			component="main"
			className="min-h-dvh"
		>
			<RegisterForm />
		</Stack>
	)
}
