"use client"

import type { ExamMultipleChoiceQuestion, ExamQuestion } from "@models/typings/Exam"
import { Button, Divider, Paper, Radio, Textarea } from "@mantine/core"
import { useForm, type DefaultValues } from "react-hook-form"
import { useId } from "react"
import useServerActionHandler from "@hooks/useServerActionHandler"
import submitExam from "../actions/submitExam"

interface SubmitExamFormProps {
	defaultValues?: DefaultValues<SubmitFormData>
	loading?: boolean
	submit?: {
		incorrectAnswers: string[]
		correctAnswers: string[]
		pendingAnswers: string[]
	}
	exam: {
		_id: string
		questions: (Pick<ExamQuestion, "type" | "text" | "isRequired"> & {
			_id: string
			options: (Pick<ExamMultipleChoiceQuestion["options"][number], "text"> & {
				_id: string
			})[]
		})[]
	}
}

interface SubmitFormData {
	question: ({
		option?: string
		content?: string
	})[]
}

export default function SubmitExamForm({
	defaultValues,
	loading,
	submit,
	exam
}: SubmitExamFormProps){
	const { handleServerAction, isPending } = useServerActionHandler()
	const titleId = useId()

	const formDisabled = loading || !!submit

	const {
		watch,
		setValue,
		register,
		clearErrors,
		handleSubmit,
		formState: { errors }
	} = useForm<SubmitFormData>({
		reValidateMode: "onChange",
		defaultValues,
		disabled: formDisabled,
		mode: "onSubmit"
	})

	return (
		<form
			className="flex flex-col gap-lg"
			onSubmit={handleSubmit(({ question: questions }) => {
				handleServerAction(submitExam(exam._id, {
					questions: questions.map((data, index) => ({
						id: exam.questions[index]._id,
						...data
					}))
				} as Parameters<typeof submitExam>[1]))
			})}
		>
			<h2 id={titleId} className="text-h3">
				Questões
			</h2>

			<ul
				className="flex flex-col gap-md"
				aria-labelledby={titleId}
			>
				{exam.questions.map(({
					_id,
					type,
					text,
					options,
					isRequired
				}, questionIndex) => {
					return (
						<Paper
							className="p-xl shadow-xs"
							component="li"
							withBorder
							key={_id}
						>
							<h3 className="text-dark-200 text-h6">
								{isRequired && (
									<span
										className="text-red-500 float-right select-none"
										aria-label="Questão obrigatória"
										title="Questão obrigatória"
									>
										*
									</span>
								)}

								Questão {questionIndex + 1}
							</h3>

							<div className="flex flex-col mt-xs gap-md">
								<p className="text-md font-medium whitespace-pre-wrap">{text}</p>

								<Divider />

								{type === "dissertative" ? (
									<Textarea
										size="md"
										label="Resposta"
										placeholder="Digite sua resposta"
										aria-label="Resposta"
										maxRows={12}
										{...register(`question.${questionIndex}.content`, {
											required: {
												value: isRequired,
												message: "Essa questão é obrigatória"
											}
										})}
										withAsterisk={false}
										error={errors.question?.[questionIndex]?.content?.message}
										spellCheck
										autosize
									/>
								) : (
									<ul className="flex flex-col gap-md">
										{options.map(({
											_id,
											text
										}, optionIndex) => {
											const optionPath = `question.${questionIndex}.option` as const
											const optionError = errors.question?.[questionIndex]?.option?.message

											return (
												<li className="flex items-center gap-md" key={_id}>
													{optionIndex === 0 && (
														<input
															type="text"
															className="sr-only"
															aria-hidden
															tabIndex={-1}
															onFocus={() => {
																const options = document.getElementsByName(optionPath)
																options[0]?.focus()
															}}
															{...register(optionPath, {
																required: {
																	value: isRequired,
																	message: "Nenhuma opção foi selecionada como a resposta correta"
																}
															})}
															name={undefined}
															defaultValue={watch(optionPath)}
														/>
													)}

													<Radio
														name={optionPath}
														size="lg"
														variant="outline"
														onChange={() => {
															setValue(optionPath, _id)
															clearErrors(optionPath)
														}}
														defaultChecked={watch(`question.${questionIndex}.option`) === _id}
														aria-label="Selecionar resposta"
														title={optionError || (!formDisabled ? "Selecionar resposta" : undefined)}
														disabled={formDisabled}
														error={!!optionError}
													/>

													<p>{text}</p>
												</li>
											)
										}
										)}
									</ul>
								)}
							</div>
						</Paper>
					)
				})}
			</ul>

			<div className="flex flex-col items-start gap-md">
				<div className="text-xs">
					<p>Este conteúdo foi criado pelo proprietário do formulário.</p>
					<p>Os dados que você enviar serão enviados ao proprietário do formulário.</p>
					<p>Nunca forneça sua senha.</p>
				</div>

				<Button
					type="submit"
					variant="filled"
					loading={isPending}
					disabled={formDisabled}
				>
					Finalizar formulário
				</Button>
			</div>
		</form>
	)
}
