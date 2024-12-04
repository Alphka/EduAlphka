import type { QuestionContainerProps } from "./QuestionContainer"
import { useWatch, type UseFieldArrayRemove } from "react-hook-form"
import { ActionIcon, Radio, TextInput } from "@mantine/core"
import { MdDeleteOutline } from "react-icons/md"
import { useRef } from "react"

interface OptionContainerProps extends Pick<QuestionContainerProps, "clearErrors" | "control" | "register" | "setValue" | "errors"> {
	questionIndex: number
	removeOption: UseFieldArrayRemove
	optionIndex: number
	canDelete: boolean
}

export default function OptionContainer({
	questionIndex,
	removeOption,
	clearErrors,
	optionIndex,
	canDelete,
	setValue,
	register,
	control,
	errors
}: OptionContainerProps){
	const optionRef = useRef<HTMLInputElement>(null)
	const watch = useWatch({ control, defaultValue: undefined })

	const contentError = errors.question?.[questionIndex]?.option?.[optionIndex]?.text?.message
	const optionError = errors.question?.[questionIndex]?.correct_answer?.message
	const optionPath = `question.${questionIndex}.correct_answer` as const

	return <>
		<Radio
			name={optionPath}
			size="lg"
			variant="outline"
			onChange={() => {
				setValue(optionPath, optionIndex)
				clearErrors(optionPath)
			}}
			defaultChecked={watch.question?.[questionIndex]?.correct_answer === optionIndex}
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
				required: {
					value: true,
					message: "O conteúdo da opção é obrigatório"
				}
			})}
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
				removeOption(questionIndex)
			}}
			disabled={canDelete}
		>
			<MdDeleteOutline className="text-[1.5rem]" />
		</ActionIcon>
	</>
}
