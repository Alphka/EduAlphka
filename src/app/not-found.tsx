import { Stack, Title } from "@mantine/core"

export default function NotFoundPage(){
	return (
		<Stack
			p="5xl"
			align="center"
			justify="center"
			component="main"
			className="min-h-dvh"
		>
			<Title order={1}>
				Página não encontrada
			</Title>
		</Stack>
	)
}
