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
	setValue: UseFormSetValue<SubmitFormData>
	register: UseFormRegister<SubmitFormData>
	errors: FieldErrors<SubmitFormData>
	watch: UseFormWatch<SubmitFormData>
	options: {
		_id: string
		text: string
	}[]
	answer: Pick<IAnswer, "content" | "feedback" | "isCorrect"> & {
		_id: string
		option?: string
	}
}

export default function SubmitExamFormQuestion({
	questionIndex,
	formDisabled,
	clearErrors,
	isRequired,
	setValue,
	register,
	options,
	errors,
	answer: {
		_id: answerId,
		option: chosenOption,
		feedback,
		...answer
	},
	watch,
	text,
	type
}: SubmitExamFormQuestionProps){
	const isCorrect = isRequired && answer.isCorrect === true
	const isPending = isRequired && !isCorrect && answer.isCorrect === undefined
	const isWrong = isRequired && !isCorrect && !isPending

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
			<div className="flex flex-row-reverse flex-wrap-reverse gap-x-md gap-y-xs">
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
}
