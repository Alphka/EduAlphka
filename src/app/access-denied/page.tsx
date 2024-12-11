import { Title } from "@mantine/core"

export default function AccessDeniedPage(){
	return (
		<main className="flex flex-col items-center justify-center p-5xl min-h-dvh">
			<Title order={1}>
				Acesso negado
			</Title>
		</main>
	)
}
