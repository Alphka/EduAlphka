import type { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import type { SubmitFormData } from "."
import type { ExamQuestion } from "@models/typings/Exam"
import type { IAnswer } from "@models/typings/Answer"
import { Paper, Divider, Textarea, Radio } from "@mantine/core"
import { twJoin } from "tailwind-merge"

interface SubmitExamFormQuestionProps extends Pick<ExamQuestion, "isRequired" | "text" | "type"> {
	questionIndex: number
	formDisabled: boolean
	clearErrors: UseFormClearErrors<SubmitFormData>
	hasSubmit: boolean
	setValue: UseFormSetValue<SubmitFormData>
	register: UseFormRegister<SubmitFormData>
	errors: FieldErrors<SubmitFormData>
	watch: UseFormWatch<SubmitFormData>
	options: {
		_id: string
		text: string
	}[]
	answer: (Pick<IAnswer, "content" | "feedback" | "isCorrect"> & {
		_id: string
		option?: string
	}) | undefined
}

export default function SubmitExamFormQuestion({
	questionIndex,
	formDisabled,
	clearErrors,
	isRequired,
	hasSubmit,
	setValue,
	register,
	options,
	errors,
	answer,
	watch,
	text,
	type
}: SubmitExamFormQuestionProps){
	const isAnswered = hasSubmit && !!answer && ("option" in answer || "content" in answer)
	const isCorrect = isRequired && isAnswered && answer.isCorrect === true
	const isPending = isRequired && isAnswered && !isCorrect && answer.isCorrect === undefined
	const isWrong = isRequired && isAnswered && !isCorrect && !isPending

	return (
		<Paper
			className={twJoin(
				"p-xl border shadow-xs",
				isCorrect && "border-green-900",
				isWrong && "border-red-900"
			)}
			component="li"
			withBorder
		>
			<div
				className={twJoin(
					"flex gap-x-md gap-y-xs",
					isRequired && hasSubmit
						? "flex-row-reverse flex-wrap-reverse"
						: hasSubmit && "flex-col-reverse"
				)}
			>
				<h3 className="flex-grow basis-full text-dark-200 text-h6">
					Questão {questionIndex + 1}
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

				{hasSubmit && isRequired && isAnswered && (
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
			</div>

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
						defaultValue={watch(`question.${questionIndex}.content`)}
						error={errors.question?.[questionIndex]?.content?.message}
						spellCheck
						autosize
						readOnly={formDisabled}
						inert={formDisabled}
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
										readOnly={formDisabled}
										inert={formDisabled}
										error={!!optionError}
									/>

									<p>{text}</p>
								</li>
							)
						}
						)}
					</ul>
				)}

				{isAnswered && isRequired && !!answer.feedback && <>
					<Divider />

					<Textarea
						size="md"
						label="Feedback do aplicador do teste"
						variant="filled"
						className={twJoin(formDisabled && "cursor-not-allowed")}
						placeholder="Feedback do aplicador do teste"
						value={answer.feedback}
						withAsterisk={false}
						classNames={{
							input: "cursor-default overflow-hidden"
						}}
						spellCheck
						autosize
						readOnly
						inert
					/>
				</>}
			</div>
		</Paper>
	)
}
