"use client"

import type { ExamInvitationProps } from ".."
import { ActionIcon, Button, CopyButton, Paper, Tooltip } from "@mantine/core"
import { generateExamInviteURL } from "../../../actions/invites"
import { MdCheck, MdCopyAll } from "react-icons/md"
import { twJoin } from "tailwind-merge"
import useServerActionHandler from "@hooks/useServerActionHandler"

interface InviteURLProps extends Pick<ExamInvitationProps, "examId"> {
	inviteURL: URL | string | undefined
}

export default function ManageInviteURL({ examId, inviteURL }: InviteURLProps){
	const { handleServerAction, isPending } = useServerActionHandler({
		successOptions: {
			message: `Link de convite ${inviteURL ? "atualizado" : "gerado"} com sucesso`
		}
	})

	if(typeof inviteURL === "string"){
		inviteURL = new URL(inviteURL)
	}

	return <>
		<div className="text-center" aria-live="polite">
			{inviteURL ? (
				<div className="flex items-stretch justify-center flex-wrap gap-sm">
					<Paper
						dir="rtl"
						className="[@media(width>290px)]:basis-3/4 block font-semibold whitespace-nowrap text-ellipsis px-sm overflow-hidden shadow-none"
						component="p"
						withBorder
					>
						{inviteURL.href}
					</Paper>

					<CopyButton
						value={inviteURL.href}
						timeout={2000}
					>
						{({ copied, copy }) => {
							const iconColor = copied ? "teal" : "gray"
							const message = copied ? "Link copiado" : "Clique para copiar o link"
							const Icon = copied ? MdCheck : MdCopyAll

							return (
								<Tooltip
									label={message}
									position="top"
									withArrow
								>
									<ActionIcon
										color={iconColor}
										variant="default"
										aria-label={message}
										onClick={copy}
									>
										<Icon className="text-base" />
									</ActionIcon>
								</Tooltip>
							)
						}}
					</CopyButton>
				</div>
			) : (
				<p className="text-dark-200">
					Não há link de convite disponível
				</p>
			)}
		</div>

		<Button
			ta="center"
			variant="default"
			className="self-center h-auto py-sm leading-normal"
			classNames={{
				label: "whitespace-normal"
			}}
			onClick={() => {
				handleServerAction(generateExamInviteURL(examId))
			}}
			loading={isPending}
		>
			{inviteURL ? "Atualizar" : "Gerar"} link de convite
		</Button>
	</>
}
