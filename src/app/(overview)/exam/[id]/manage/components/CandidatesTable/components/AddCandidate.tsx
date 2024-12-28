"use client"

import type { CandidatesTableProps } from ".."
import { Button, TextInput } from "@mantine/core"
import { addCandidate } from "../../../actions/candidates"
import { MdSearch } from "react-icons/md"
import { useRef } from "react"
import useServerActionHandler from "@hooks/useServerActionHandler"

interface AddCandidateProps extends Pick<CandidatesTableProps, "examId"> {}

export default function AddCandidate({ examId }: AddCandidateProps){
	const { handleServerAction, isPending } = useServerActionHandler()
	const inputRef = useRef<HTMLInputElement>(null)

	return (
		<section className="flex flex-col gap-md">
			<header>
				<h3 className="text-h6 font-semibold">
					Adicionar candidato ao teste
				</h3>
			</header>

			<form className="flex items-center justify-center flex-wrap gap-x-xs gap-y-sm">
				<TextInput
					size="sm"
					className="flex-grow basis-60"
					placeholder="Nome de usuário ou e-mail"
					aria-label="Digite o nome de usuário ou email do candidato a ser adicionado"
					leftSection={<MdSearch className="text-base" />}
					onKeyDown={event => {
						if(event.key === "Enter"){
							event.preventDefault()

							const { currentTarget: input } = event
							const value = input?.value?.trim()

							if(!value) return

							handleServerAction(addCandidate(examId, value))
						}
					}}
					enterKeyHint="send"
					ref={inputRef}
				/>

				<Button
					type="submit"
					size="sm"
					color="blue"
					variant="light"
					className="flex-shrink-0"
					aria-label="Adicionar candidato ao teste"
					onClick={event => {
						event.preventDefault()

						const { current: input } = inputRef
						const value = input?.value?.trim()

						if(!value) return

						handleServerAction(addCandidate(examId, value))
					}}
					loading={isPending}
				>
					Adicionar
				</Button>
			</form>
		</section>
	)
}
