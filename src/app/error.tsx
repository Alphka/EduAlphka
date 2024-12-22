"use client"

import { Button, Container, Text, Title } from "@mantine/core"
import { useEffect } from "react"

interface ServerErrorPageProps {
	error: Error & { digest?: string }
	reset: () => void
}

export default function ServerErrorPage({ error, reset }: ServerErrorPageProps){
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<div className="min-h-dvh bg-blue-800 flex flex-col items-center justify-center pt-20 pb-32 gap-3xl">
			<Container>
				<div className="text-white/60 text-center text-[120px] sm:text-[220px] font-[900] leading-none mb-xl">
					500
				</div>

				<Title className="text-white text-center text-2xl sm:text-1xl font-[900]">
					Algo deu errado...
				</Title>

				<Text size="lg" ta="center" className="max-w-lg text-blue-100 mx-auto mt-xl mb-2xl">
					Nossos servidores não conseguiram lidar com sua solicitação.
					{/* Não se preocupe, nossa equipe de desenvolvimento já foi notificada. */}
					Tente atualizar a página.
				</Text>

				<div className="flex items-center justify-center">
					<Button
						size="md"
						variant="white"
						onClick={() => reset()}
					>
						Atualizar a página
					</Button>
				</div>
			</Container>
		</div>
	)
}
