"use client"

import { useEffect } from "react"
import { Button } from "@mantine/core"

interface ServerErrorPageProps {
	error: Error & { digest?: string }
	reset: () => void
}

export default function ServerErrorPage({ error, reset }: ServerErrorPageProps){
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<div className="min-h-dvh bg-blue-800 flex flex-col items-center justify-center px-xs py-20 pt-20 pb-32 gap-3xl">
			<div className="relative">
				<div className="block w-full h-min absolute top-0 left-0 right-0 text-white/60 text-center text-[60px] xs:text-[120px] sm:text-[250px] font-[900] leading-[.8] overflow-hidden select-none">
					500
				</div>

				<div className="relative z-1 pt-16 xs:pt-28 sm:pt-56 text-center">

					<h1 className="text-white text-center text-h2 sm:text-h1 !font-[900]">
						Algo deu errado...
					</h1>

					<p className="max-w-lg text-blue-100 text-lg text-center mx-auto mt-xl mb-2xl">
						Nossos servidores não conseguiram lidar com sua solicitação.
						Tente atualizar a página.
					</p>

					{/* Não se preocupe, nossa equipe de desenvolvimento já foi notificada. */}

					<div className="flex items-center justify-center">
						<Button
							size="sm"
							variant="white"
							aria-label="Atualizar a página"
							onClick={() => reset()}
						>
							Atualizar a página
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
