"use client"

import type { ComponentProps } from "react"
import { removeCandidate } from "../../../actions/candidates"
import { MdDeleteOutline } from "react-icons/md"
import { MenuItem } from "@mantine/core"
import useServerActionHandler from "@hooks/useServerActionHandler"

interface RemoveCandidateButtonProps extends Omit<ComponentProps<typeof MenuItem<"button">>, "children"> {
	candidateId: string
	examId: string
}

export default function RemoveCandidateButton({ candidateId, examId, disabled, ...props }: RemoveCandidateButtonProps){
	const { handleServerAction, isPending } = useServerActionHandler()

	return (
		<MenuItem
			{...props}
			color="red"
			onClick={() => handleServerAction(removeCandidate(examId, candidateId))}
			disabled={disabled || isPending}
			leftSection={<MdDeleteOutline className="text-base" />}
		>
			Remover acesso
		</MenuItem>
	)
}
