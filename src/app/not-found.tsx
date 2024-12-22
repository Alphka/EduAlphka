"use client"

import { useRouter } from "next/navigation"
import { Button } from "@mantine/core"

export default function NotFoundPage(){
	const router = useRouter()

	return (
		<div className="min-h-dvh flex flex-col items-center justify-center px-xs py-20 gap-3xl">
			<div className="relative">
				<div className="block w-full h-min absolute top-0 left-0 right-0 text-gray-700/75 text-center text-[60px] xs:text-[120px] sm:text-[250px] font-[900] leading-[.8] overflow-hidden select-none">
					404
				</div>

				<div className="relative z-[1] pt-16 xs:pt-28 sm:pt-56 text-center">
					<h1 className="font-black text-2xl sm:text-1xl">
						Página não encontrada
					</h1>

					<p className="text-lg text-gray-500 max-w-lg mx-auto mt-6 mb-12">
						A página que você está tentando abrir não existe.
						Você pode ter digitado o endereço errado ou a página foi movida para outra URL.
						Se você acha que isso é um erro, entre em contato com o suporte.
					</p>

					<div className="flex justify-center">
						<Button
							size="md"
							aria-label="Voltar para a página anterior"
							onClick={() => {
								if(window.history.length > 1) router.back()
								else router.push("/")
							}}
						>
							Voltar
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
