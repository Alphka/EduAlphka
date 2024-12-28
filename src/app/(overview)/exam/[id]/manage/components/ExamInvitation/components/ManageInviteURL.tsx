"use client"

import type { ExamInvitationProps } from ".."
import { generateExamInviteURL } from "../../../actions/invites"
import { ActionIcon, Button, CopyButton, Paper, Tooltip } from "@mantine/core"
import { twJoin } from "tailwind-merge"
import useServerActionHandler from "@hooks/useServerActionHandler"
import { MdCheck, MdCopyAll } from "react-icons/md"

interface InviteURLProps extends Pick<ExamInvitationProps, "examId"> {
	inviteURL: URL | string | undefined
}

export default function ManageInviteURL({ examId, inviteURL }: InviteURLProps){
	const { handleServerAction, isPending } = useServerActionHandler({
		successMessage: `Link de convite ${inviteURL ? "atualizado" : "gerado"} com sucesso`
	})

	if(typeof inviteURL === "string"){
		inviteURL = new URL(inviteURL)
	}

	return <>
		<div aria-live="polite">
			{inviteURL ? (
				<div className="flex items-stretch justify-center flex-wrap text-center gap-sm">
					<Paper
						dir="rtl"
						className={twJoin(
							"flex items-center px-sm shadow-none",
							"font-semibold text-ellipsis whitespace-nowrap overflow-hidden"
						)}
						component="span"
						withBorder
					>
						{inviteURL.href}
					</Paper>

					<CopyButton
						value={inviteURL.href}
						timeout={2000}
					>
						{({ copied, copy }) => (
							<Tooltip
								label={copied ? "Link copiado" : "Clique para copiar o link"}
								position="top"
								withArrow
							>
								<ActionIcon
									color={copied ? "teal" : "gray"}
									variant="default"
									onClick={copy}
									aria-label="Clique para copiar o link"
									aria-live="off"
								>
									{copied ? <MdCheck className="text-base" /> : <MdCopyAll className="text-base" />}
								</ActionIcon>
							</Tooltip>
						)}
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
