"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@mantine/core"

export default function BackButton(props: ComponentPropsWithoutRef<typeof Button<"button">>){
	const router = useRouter()

	return (
		<Button
			onClick={() => {
				if(window.history.length > 1) router.back()
				else router.push("/")
			}}
			aria-label="Voltar para a página anterior"
			children="Voltar"
			{...props}
		/>
	)
}
