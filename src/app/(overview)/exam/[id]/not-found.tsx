"use client"

import { Button, Title } from "@mantine/core"
import { useRouter } from "next/navigation"

export default function NotFoundPage(){
	const router = useRouter()

	return (
		<div className="main-height flex flex-col items-center justify-center p-5xl gap-3xl">
			<Title
				order={1}
				fz="h2"
				fw={600}
				ta="center"
			>
				Esse teste não foi encontrado
			</Title>

			<Button
				aria-label="Voltar para a página anterior"
				onClick={() => {
					if(window.history.length > 1) router.back()
					else router.push("/")
				}}
			>
				Voltar
			</Button>
		</div>
	)
}
