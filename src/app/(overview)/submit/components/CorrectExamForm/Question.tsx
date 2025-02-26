"use client"

import type { CorrectExamFormProps } from "."
import type { ExamQuestion } from "@models/typings/Exam"
import type { RefObject } from "react"
import { Button, Divider, LoadingOverlay, Paper, Radio, Textarea } from "@mantine/core"
import { twJoin } from "tailwind-merge"
import { useRef } from "react"
import useServerActionHandler from "@hooks/useServerActionHandler"
import correctExamAnswer from "../../actions/correctExamAnswer"

interface CorrectExamFormQuestionProps extends Pick<ExamQuestion, "isRequired" | "text" | "type"> {
	questionNumber: number
	formDisabled: boolean
	questionRef: RefObject<HTMLLIElement | null>
	options: {
		_id: string
		text: string
	}[]
	answer: Omit<CorrectExamFormProps["answers"][number], "question"> | undefined
}

export default function CorrectExamFormQuestion({
	questionNumber,
	formDisabled,
	questionRef,
	isRequired,
	options,
	answer,
	text,
	type
}: CorrectExamFormQuestionProps){
	const { handleServerAction, isPending: isLoading } = useServerActionHandler()
	const feedbackRef = useRef<HTMLTextAreaElement>(null)

	const isAnswered = !!answer && ("option" in answer || "content" in answer)
	const isCorrect = isRequired && answer?.isCorrect === true
	const isPending = isRequired && !isCorrect && !!answer && answer.isCorrect === undefined
	const isWrong = isRequired && !isCorrect && !isPending

	return (
		<Paper
			className={twJoin(
				"p-xl border shadow-xs",
				isPending && "border-yellow-900"
			)}
			data-pending={isPending}
			component="li"
			withBorder
			ref={questionRef}
		>
			<section>
				<header className="flex flex-row-reverse flex-wrap-reverse gap-x-md gap-y-xs">
					<h1 className="flex-grow basis-full text-dark-200 text-h6">
						Questão {questionNumber}
					</h1>

					{isRequired && (
						<p
							className="text-red-500 float-right select-none"
							aria-label="Questão obrigatória"
							title="Questão obrigatória"
						>
							*
						</p>
					)}

					{isRequired && isAnswered && (
						<p
							className={twJoin(
								"flex-grow text-dark-200 text-md",
								isCorrect && "text-green-600",
								isPending && "text-yellow-600",
								isWrong && "text-red-600"
							)}
						>
							Resposta {isCorrect ? "correta" : isWrong ? "incorreta" : isPending && "pendente de correção"}
						</p>
					)}
				</header>

				<div className="flex flex-col mt-xs gap-md">
					<p className="text-md font-medium">{text}</p>

					<Divider />

					{type === "dissertative" ? (
						<div className="flex flex-col gap-lg">
							<Textarea
								size="md"
								label="Resposta"
								variant="filled"
								aria-label={`Resposta da questão ${questionNumber}`}
								value={answer?.content || ""}
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
										className={twJoin(formDisabled && "cursor-not-allowed")}
										placeholder="Adicione um feedback para o usuário"
										minRows={2}
										maxRows={12}
										withAsterisk={false}
										defaultValue={answer!.feedback}
										spellCheck
										autosize
										readOnly={formDisabled}
										inert={formDisabled}
										ref={feedbackRef}
									/>

									<Divider hiddenFrom="xs" />

									{!formDisabled && (
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
													handleServerAction(correctExamAnswer(
														answer!._id,
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
												onClick={() => handleServerAction(correctExamAnswer(
													answer!._id,
													false,
													feedbackRef.current?.value.trim() || undefined
												))}
												aria-label="Marcar resposta como incorreta"
											>
												Marcar como incorreta
											</Button>
										</div>
									)}
								</section>
							</>}
						</div>
					) : (
						<ul className="flex flex-col gap-md">
							{options.map(({ _id: optionId, text }) => {
								const checked = !!answer && answer.option === optionId

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
			</section>
		</Paper>
	)
}
