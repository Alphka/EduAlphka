import type { UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form"
import type { QuestionContainerProps } from "./QuestionContainer"
import type { ExamFormData } from ".."
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { ActionIcon, Radio, TextInput } from "@mantine/core"
import { useCallback, useRef } from "react"
import { MdDeleteOutline } from "react-icons/md"

interface OptionContainerProps extends Pick<QuestionContainerProps, "clearErrors" | "register" | "setValue" | "errors" | "watch"> {
	defaultOption: NonNullable<ExamFormData["question"][number]["option"]>[number]
	questionIndex: number
	removeOption: UseFieldArrayRemove
	appendOption: UseFieldArrayAppend<ExamFormData, `question.${number}.option`>
	optionIndex: number
	canDelete: boolean
}

export default function OptionContainer({
	defaultOption,
	questionIndex,
	appendOption,
	removeOption: _removeOption,
	clearErrors,
	optionIndex,
	canDelete,
	setValue,
	register,
	errors,
	watch
}: OptionContainerProps){
	const optionRef = useRef<HTMLInputElement>(null)

	const contentError = errors.question?.[questionIndex]?.option?.[optionIndex]?.text?.message
	const optionError = errors.question?.[questionIndex]?.correct_answer?.message
	const optionPath = `question.${questionIndex}.correct_answer` as const

	const removeOption: typeof _removeOption = useCallback((index) => {
		if(!index) return

		const indexes = Array.isArray(index) ? index : [index]

		if(indexes.includes(optionIndex)){
			setValue(optionPath, undefined)
		}

		_removeOption(index)
	}, [_removeOption, optionIndex, setValue])

	return <>
		<Radio
			name={optionPath}
			size="lg"
			variant="outline"
			onChange={() => {
				setValue(optionPath, optionIndex)
				clearErrors(optionPath)
			}}
			defaultChecked={watch(`question.${questionIndex}.correct_answer`) === optionIndex}
			aria-label="Definir como a resposta correta"
			title={optionError || "Definir como a resposta correta"}
			error={!!optionError}
			ref={optionRef}
		/>

		<TextInput
			size="md"
			flex={1}
			placeholder={`Opção ${optionIndex + 1}`}
			{...register(`question.${questionIndex}.option.${optionIndex}.text`, {
				minLength: {
					value: ExamFormValidation.questionOptionMinLength,
					message: `O texto da opção deve ter no mínimo ${ExamFormValidation.questionOptionMinLength} caracteres`
				},
				maxLength: {
					value: ExamFormValidation.questionOptionMaxLength,
					message: `O texto da opção deve ter no máximo ${ExamFormValidation.questionOptionMaxLength} caracteres`
				},
				pattern: {
					value: new RegExp(GenericFormValidation.validDescriptionPattern),
					message: "O texto da opção contém caracteres inválidos"
				},
				required: {
					value: true,
					message: "O conteúdo da opção é obrigatório"
				}
			})}
			defaultValue={watch(`question.${questionIndex}.option.${optionIndex}.text`)}
			onKeyDown={event => {
				const getTextInput = (index: number) => {
					return document.querySelector<HTMLInputElement>(`input[name="question.${questionIndex}.option.${index}.text"]`)
				}

				switch(event.key){
					case "Delete":
					case "Backspace":
						if(canDelete && !event.currentTarget.value){
							event.preventDefault()

							const previousTextInput = getTextInput(optionIndex - 1)

							previousTextInput?.focus()
							removeOption(optionIndex)
						}
					break
					case "Enter": {
						event.preventDefault()

						const nextTextInput = getTextInput(optionIndex + 1)

						if(nextTextInput){
							nextTextInput.focus()
						}else{
							appendOption(defaultOption)
						}
					}
					break
				}
			}}
			enterKeyHint="next"
			title={contentError || "Conteúdo da opção"}
			error={!!contentError}
		/>

		<ActionIcon
			size="lg"
			color="red"
			variant="light"
			className="shrink-0"
			aria-label={`Remover ${optionIndex + 1}ª opção`}
			title="Remover opção"
			onClick={() => {
				removeOption(optionIndex)
			}}
			disabled={!canDelete}
		>
			<MdDeleteOutline className="text-[1.5rem]" />
		</ActionIcon>
	</>
}
