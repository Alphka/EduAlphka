"use client"

import type { CorrectExamFormProps } from "."
import type { ExamQuestion } from "@models/typings/Exam"
import { Button, Divider, LoadingOverlay, Paper, Radio, Textarea } from "@mantine/core"
import { twJoin } from "tailwind-merge"
import { useRef } from "react"
import useServerActionHandler from "@hooks/useServerActionHandler"
import correctExamAnswer from "../../actions/correctExamAnswer"

interface CorrectExamFormQuestionProps extends Pick<ExamQuestion, "isRequired" | "text" | "type"> {
	questionNumber: number
	submitId: string
	options: {
		_id: string
		text: string
	}[]
	answer: Omit<CorrectExamFormProps["answers"][number], "question">
}

export default function CorrectExamFormQuestion({
	questionNumber,
	isRequired,
	submitId,
	options,
	answer: {
		_id: answerId,
		option: chosenOption,
		feedback,
		...answer
	},
	text,
	type
}: CorrectExamFormQuestionProps){
	const { handleServerAction, isPending: isLoading } = useServerActionHandler()
	const feedbackRef = useRef<HTMLTextAreaElement>(null)

	const isCorrect = isRequired && answer.isCorrect === true
	const isPending = isRequired && !isCorrect && answer.isCorrect === undefined
	const isWrong = isRequired && !isCorrect && !isPending

	return (
		<Paper
			className={twJoin(
				"p-xl border shadow-xs",
				isPending && "border-yellow-900",
			)}
			component="li"
			withBorder
		>
			<div className="flex flex-row-reverse flex-wrap-reverse gap-x-md gap-y-xs">
				<h3 className="flex-grow basis-full text-dark-200 text-h6">
					Questão {questionNumber}
				</h3>

				{isRequired && (
					<p
						className="text-red-500 float-right select-none"
						aria-label="Questão obrigatória"
						title="Questão obrigatória"
					>
						*
					</p>
				)}

				<p
					className={twJoin(
						"flex-grow text-dark-200 text-md",
						isCorrect && "text-green-600",
						isPending && "text-yellow-600",
						isWrong && "text-red-600"
					)}
				>
					Resposta {isCorrect ? "correta" : isWrong ? "incorreta" : "pendente de correção"}
				</p>
			</div>

			<div className="flex flex-col mt-xs gap-md">
				<p className="text-md font-medium">{text}</p>

				<Divider />

				{type === "dissertative" ? (
					<div className="flex flex-col gap-lg">
						<Textarea
							size="md"
							label="Resposta"
							variant="filled"
							aria-label="Resposta"
							value={answer.content || ""}
							withAsterisk={false}
							classNames={{
								input: "cursor-default overflow-hidden"
							}}
							spellCheck
							autosize
							readOnly
							inert
						/>

						{isRequired && <>
							<Divider />

							<section className="flex flex-col gap-md">
								<h4 className="text-h4">Corrigir resposta</h4>

								<Textarea
									size="md"
									label="Feedback"
									placeholder="Adicione um feedback para o usuário"
									minRows={2}
									maxRows={12}
									withAsterisk={false}
									defaultValue={feedback}
									spellCheck
									autosize
									ref={feedbackRef}
								/>

								<Divider hiddenFrom="xs" />

								<div className="relative flex flex-col xs:self-start xs:flex-row xs:flex-wrap gap-md">
									<LoadingOverlay
										overlayProps={{
											radius: "sm",
											blur: 2
										}}
										visible={isLoading}
										zIndex={1}
									/>

									<Button
										size="sm"
										color="green.9"
										variant="light"
										onClick={() => {
											if(isCorrect) return

											handleServerAction(correctExamAnswer(
												submitId,
												answerId,
												true,
												feedbackRef.current?.value.trim() || undefined
											))
										}}
										aria-label="Marcar resposta como correta"
									>
										Marcar como correta
									</Button>

									<Button
										size="sm"
										color="red.9"
										variant="light"
										onClick={() => {
											if(isWrong) return

											handleServerAction(correctExamAnswer(
												submitId,
												answerId,
												false,
												feedbackRef.current?.value.trim() || undefined
											))
										}}
										aria-label="Marcar resposta como incorreta"
									>
										Marcar como incorreta
									</Button>
								</div>
							</section>
						</>}
					</div>
				) : (
					<ul className="flex flex-col gap-md">
						{options.map(({ _id: optionId, text }) => {
							const checked = chosenOption === optionId

							return (
								<li className="flex items-center gap-md" key={optionId}>
									<Radio
										size="lg"
										variant="outline"
										checked={checked}
										classNames={{
											radio: "cursor-default"
										}}
										readOnly
										inert
									/>

									<p>{text}</p>
								</li>
							)
						})}
					</ul>
				)}
			</div>
		</Paper>
	)
}

// TODO: Add button to submit correction
// TODO: Add a property to the Submit collection to save when the correction is submitted
// TODO: Do not show feedbacks or corrected answers until all the corrections is sent
// TODO: Add warning for the professor saying the correction can't be modified after being sent
// TODO: Notify user after the corrections are submitted
