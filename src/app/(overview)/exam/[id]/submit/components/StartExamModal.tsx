"use client"

import type { ExamMultipleChoiceQuestion, ExamQuestion, IExam } from "@models/typings/Exam"
import type { IUser } from "@models/typings/User"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import * as Dialog from "@radix-ui/react-dialog"
import { Button, Fieldset, Grid, Paper } from "@mantine/core"
import { isFinite } from "lodash"
import { twJoin } from "tailwind-merge"
import formatTimeDuration from "@helpers/formatTimeDuration"

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
							"h-full",
							"flex flex-col items-center justify-center px-4 xs:px-8 sm:px-12",
							"outline-none"
						)}
					>
						<VisuallyHidden.Root asChild>
							<Dialog.Title className="DialogTitle">Iniciar teste</Dialog.Title>
						</VisuallyHidden.Root>

						<Paper
							className={twJoin(
								"w-10/12 max-w-screen-lg",
								"flex flex-col px-lg py-2xl gap-lg shadow-xs"
							)}
							withBorder
						>
							<h1 className="text-center text-h2 font-bold">
								Você deseja iniciar o teste?
							</h1>

							<Paper
								bg="dark.6"
								className="p-lg"
								component={Fieldset}
								legend="Informações do teste"
								shadow="none"
							>
								<Grid
									gutter="sm"
									grow
								>
									<Grid.Col className="flex items-baseline gap-1">
										<p className="text-5xl font-semibold">Professor:</p>
										<span className="text-gray-500">{exam.owner.name}</span>
									</Grid.Col>

									{exam.subject && (
										<Grid.Col className="flex items-baseline gap-1">
											<p className="text-5xl font-semibold">Disciplina:</p>
											<span className="text-gray-500">{exam.subject}</span>
										</Grid.Col>
									)}

									<Grid.Col className="flex items-baseline gap-1">
										<p className="text-5xl font-semibold">Total de questões:</p>
										<span className="text-gray-500">{totalQuestions}</span>
									</Grid.Col>

									<Grid.Col className="flex items-baseline gap-1">
										<p className="text-5xl font-semibold">Questões obrigatórias:</p>
										<span className="text-gray-500">{maxGrade}</span>
									</Grid.Col>

									<Grid.Col className="flex items-baseline gap-1">
										<p className="text-5xl font-semibold">Tempo de duração:</p>
										<span className="text-gray-500">{formatTimeDuration(exam.duration)}</span>
									</Grid.Col>

									{exam.expiresAt && (
										<Grid.Col className="flex items-baseline gap-1">
											<p className="text-5xl font-semibold">Data final para entrega:</p>
											<span className="text-gray-500">{exam.expiresAt.toLocaleString("pt-BR")}</span>
										</Grid.Col>
									)}

									<Grid.Col className="flex items-baseline gap-1">
										<p className="text-5xl font-semibold">Descrição:</p>
										<p className="text-gray-500 whitespace-pre-wrap">{exam.description}</p>
									</Grid.Col>
								</Grid>
							</Paper>

							<p className="text-h6">
								Após iniciar o teste,
								você terá {getDurationString(exam.duration)} para completá-lo.<br />
								Certifique-se de estar preparado antes de começar.
							</p>

							<Button
								size="sm"
								variant="filled"
								className="self-center"
								aria-label="Iniciar teste"
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
