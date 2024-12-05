import type { Metadata } from "next"
import { APPLICATION_NAME } from "@constants/index"
import { Stack } from "@mantine/core"
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
		<Stack
			p="5xl"
			align="center"
			justify="center"
			component="main"
			className="min-h-dvh"
		>
			<LoginForm />
		</Stack>
	)
}
