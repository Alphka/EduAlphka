"use client"

import type { ExamMultipleChoiceQuestion, ExamQuestion, IExam } from "@models/typings/Exam"
import type { IUser } from "@models/typings/User"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import * as Dialog from "@radix-ui/react-dialog"
import { Button, Paper } from "@mantine/core"
import { isFinite } from "lodash"
import { twJoin } from "tailwind-merge"
import { useId } from "react"
import useServerActionHandler from "@hooks/useServerActionHandler"
import formatTimeDuration from "@helpers/formatTimeDuration"
import startExam from "../actions/startExam"

interface StartExamModalProps {
	exam: Pick<IExam, "createdAt" | "title" | "description" | "subject" | "duration" | "expiresAt"> & {
		_id: string
		owner: Pick<IUser, "name">
		questions: (Pick<ExamQuestion, "type" | "text" | "isRequired"> & {
			_id: string
			options: (Pick<ExamMultipleChoiceQuestion["options"][number], "text"> & {
				_id: string
			})[]
		})[]
	}
}

function getDurationString(duration: number | ReturnType<typeof formatTimeDuration>){
	if(typeof duration === "number") duration = formatTimeDuration(duration)

	const [hours, minutes] = duration.split(":").map(Number)

	if(!isFinite(hours) || !isFinite(minutes)) throw new Error(`Invalid duration: ${duration}`)

	const hoursText = `${hours} ${hours === 1 ? "hora" : "horas"}` as const
	const minutesText = `${minutes} ${minutes === 1 ? "minuto" : "minutos"}` as const

	if(minutes === 0) return hoursText
	if(hours === 0) return minutesText

	return `${hoursText} e ${minutesText}` as const
}

export default function StartExamModal({ exam }: StartExamModalProps){
	const durationId = useId()
	const { handleServerAction, isPending } = useServerActionHandler()

	const totalQuestions = exam.questions.length
	const requiredQuestions = exam.questions.filter(({ isRequired }) => isRequired)
	const maxGrade = requiredQuestions.length

	return (
		<Dialog.Root open={true} modal>
			<Dialog.Portal forceMount>
				<Dialog.Overlay
					className="fixed inset-0 bg-dark-900 z-10"
				>
					<Dialog.Content
						className={twJoin(
							"relative z-10 h-full",
							"flex flex-col items-center justify-center px-4 xs:px-8 sm:px-12 py-10",
							"outline-none"
						)}
					>
						<VisuallyHidden.Root asChild>
							<Dialog.Title>Iniciar teste</Dialog.Title>
						</VisuallyHidden.Root>

						<Paper
							className={twJoin(
								"max-h-full sm:w-10/12 max-w-screen-md overflow-auto",
								"flex flex-col px-lg py-xl gap-lg shadow-xs",
								"*:flex-shrink-0",
								"[scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,.3)_transparent]"
							)}
							withBorder
						>
							<h1 className="text-center text-h2 font-bold">
								Você deseja iniciar o teste?
							</h1>

							<div className="flex flex-col gap-sm">
								<h2 className="text-h5 font-semibold">
									Informações do teste
								</h2>

								<Paper
									bg="dark.6"
									className="px-md py-sm shadow-xs *:font-semibold"
									component="ul"
									withBorder
								>
									<li>
										<span className="text-blue-300">Professor: </span>
										<span className="font-normal">{exam.owner.name}</span>
									</li>

									{exam.subject && (
										<li>
											<span className="text-blue-300">Disciplina: </span>
											<span className="font-normal">{exam.subject}</span>
										</li>
									)}

									<li>
										<span className="text-blue-300">Nota máxima: </span>
										<span className="font-normal">{maxGrade}</span>
									</li>

									<li>
										<span className="text-blue-300">Total de questões: </span>
										<span className="font-normal">{totalQuestions}</span>
									</li>

									<li>
										<span className="text-blue-300">Tempo de duração: </span>
										<span className="font-normal" aria-labelledby={durationId}>{formatTimeDuration(exam.duration)}</span>
									</li>

									{exam.expiresAt && (
										<li>
											<span className="text-blue-300">Data final para entrega: </span>
											<span className="font-normal">{exam.expiresAt.toLocaleString("pt-BR")}</span>
										</li>
									)}

									<li>
										<span className="text-blue-300">Descrição: </span>
										<span className="font-normal whitespace-pre-wrap">{exam.description}</span>
									</li>
								</Paper>
							</div>

							<p className="text-justify text-h6 font-normal">
								Após iniciar o teste,
								você terá <span id={durationId} className="text-blue-500">{getDurationString(exam.duration)}</span> para completá-lo.<br />
								Certifique-se de estar preparado antes de começar.
							</p>

							<Button
								size="sm"
								variant="filled"
								className="self-center"
								onClick={() => {
									handleServerAction(startExam(exam._id.toString()))
								}}
								aria-label="Iniciar teste"
								loading={isPending}
							>
								Iniciar
							</Button>
						</Paper>
					</Dialog.Content>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
