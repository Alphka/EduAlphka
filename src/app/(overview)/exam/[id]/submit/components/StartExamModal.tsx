"use client"

import type { ExamMultipleChoiceQuestion, ExamQuestion, IExam } from "@models/typings/Exam"
import type { IUser } from "@models/typings/User"
import { Button, Paper, Tooltip } from "@mantine/core"
import { useInterval } from "@mantine/hooks"
import { useEffect } from "react"
import { isFinite } from "lodash"
import { useState } from "react"
import { twJoin } from "tailwind-merge"
import { toast } from "react-toastify"
import { useId } from "react"
import useServerActionHandler from "@hooks/useServerActionHandler"
import formatTimeDuration from "@helpers/formatTimeDuration"
import startExam from "../actions/startExam"
import * as Dialog from "@radix-ui/react-dialog"

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

interface StartExamModalProps {
	exam: Pick<IExam, "createdAt" | "title" | "description" | "subject" | "duration" | "startsAt" | "expiresAt"> & {
		_id: string
		owner: Pick<IUser, "name">
		questions: (Pick<ExamQuestion, "type" | "text" | "isRequired"> & {
			_id: string
			options: (Pick<ExamMultipleChoiceQuestion["options"][number], "text"> & {
				_id: string
			})[]
		})[]
	}
	expiringDuration: number
}

export default function StartExamModal({ exam, ...props }: StartExamModalProps){
	const [expiringDuration, setExpiringDuration] = useState(props.expiringDuration)
	const [canStartExam, setCanStartExam] = useState(() => !exam.startsAt || Date.now() > exam.startsAt.getTime())
	const { handleServerAction, isPending } = useServerActionHandler()
	const durationId = useId()
	const toastId = useId()

	const isExpiring = props.expiringDuration < exam.duration
	const durationString = getDurationString(expiringDuration)
	const totalQuestions = exam.questions.length
	const requiredQuestions = exam.questions.filter(({ isRequired }) => isRequired)
	const maxGrade = requiredQuestions.length

	const { active, start: startTimer } = useInterval(() => {
		let expiringExamDuration = exam.duration

		if(exam.expiresAt){
			expiringExamDuration = Math.min(exam.duration, (exam.expiresAt.getTime() - Date.now()) / 1000 / 60)
			if(expiringExamDuration < 0) expiringExamDuration = 0
		}

		setExpiringDuration(expiringExamDuration)
	}, 1000, { autoInvoke: isExpiring })

	useEffect(() => {
		if(!exam.expiresAt || active) return

		setTimeout(startTimer, exam.expiresAt.getTime() - Date.now())
	}, [active, exam.expiresAt?.getTime()])

	useEffect(() => {
		if(!exam.startsAt || canStartExam) return

		const startsAtDateString = exam.startsAt.toLocaleDateString("pt-BR") === new Date().toLocaleDateString("pt-BR")
			? " às " + exam.startsAt.toLocaleTimeString("pt-BR")
			: " em " + exam.startsAt.toLocaleString("pt-BR", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			}).replace(", ", " às ")

		const id = toast.warn("O teste só poderá ser inciado" + startsAtDateString, {
			toastId,
			pauseOnHover: false,
			closeOnClick: false,
			closeButton: false,
			draggable: false,
			autoClose: false,
			position: "bottom-right"
		})

		const timeout = setTimeout(() => {
			toast.update(id, {
				type: "success",
				render: "O teste já pode ser iniciado!",
				autoClose: undefined
			})

			setCanStartExam(true)

			window.focus()
		}, exam.startsAt.getTime() - Date.now())

		return () => clearTimeout(timeout)
	}, [canStartExam])

	return (
		<Dialog.Root open={true} modal>
			<Dialog.Portal forceMount>
				<Dialog.Overlay className="fixed inset-0 bg-dark-900 z-10">
					<Dialog.Content
						className={twJoin(
							"relative z-10 h-full",
							"flex flex-col items-center justify-center px-4 xs:px-8 sm:px-12 py-10",
							"outline-none"
						)}
					>
						<Paper
							className={twJoin(
								"max-h-full sm:w-10/12 max-w-screen-md overflow-auto",
								"flex flex-col px-lg py-xl gap-lg shadow-xs",
								"*:flex-shrink-0",
								"[scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,.3)_transparent]"
							)}
							withBorder
						>
							<Dialog.Title asChild>
								<h1 className="text-center text-h2 font-bold">
									Você deseja iniciar o teste?
								</h1>
							</Dialog.Title>

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
										<span className="text-blue-300">Aplicador do teste: </span>
										<span className="font-normal break-words">{exam.owner.name}</span>
									</li>

									{exam.subject && (
										<li>
											<span className="text-blue-300">Disciplina: </span>
											<span className="font-normal break-words">{exam.subject}</span>
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
										{isExpiring ? (
											<span className="font-normal">
												<Tooltip
													py="sm"
													px="md"
													fz="xs"
													label="O teste está prestes a expirar!"
													events={{ hover: true, focus: false, touch: true }}
													position="top"
													withArrow
												>
													<span className="text-red-500" aria-labelledby={durationId}>
														{formatTimeDuration(expiringDuration)}
													</span>
												</Tooltip> (-{formatTimeDuration(exam.duration - Math.floor(expiringDuration))})
											</span>
										) : (
											<span className="font-normal" aria-labelledby={durationId}>
												{formatTimeDuration(expiringDuration)}
											</span>
										)}
									</li>

									{exam.expiresAt && (
										<li>
											<span className="text-blue-300">Data final para entrega: </span>
											<span className="font-normal">
												{exam.expiresAt.toLocaleString("pt-BR", {
													day: "2-digit",
													month: "2-digit",
													year: "numeric",
													hour: "2-digit",
													minute: "2-digit"
												})}
											</span>
										</li>
									)}

									<li>
										<span className="text-blue-300">Descrição: </span>
										<span className="font-normal whitespace-pre-wrap break-words">{exam.description}</span>
									</li>
								</Paper>
							</div>

							<Dialog.Description asChild>
								<p className="text-justify text-h6 font-normal">
									Após iniciar o teste,
									você terá <span id={durationId} className="text-blue-500">{durationString}</span> para completá-lo.<br />
									Certifique-se de estar preparado antes de começar.
								</p>
							</Dialog.Description>

							<Button
								size="sm"
								variant="filled"
								className="self-center"
								onClick={() => handleServerAction(startExam(exam._id.toString()))}
								aria-label="Iniciar teste"
								loading={isPending}
								disabled={!canStartExam}
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
