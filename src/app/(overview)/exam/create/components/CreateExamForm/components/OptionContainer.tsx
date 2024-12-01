import type { QuestionContainerProps } from "./QuestionContainer"
import type { UseFieldArrayRemove } from "react-hook-form"
import { ActionIcon, Radio, TextInput } from "@mantine/core"
import { MdDeleteOutline } from "react-icons/md"

interface OptionContainerProps extends Pick<QuestionContainerProps, "clearErrors" | "register" | "setValue" | "errors"> {
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
	errors
}: OptionContainerProps){
	const contentError = errors.question?.[questionIndex]?.option?.[optionIndex]?.text?.message
	const optionError = errors.question?.[questionIndex]?.correct_answer?.message

	return <>
		<Radio
			size="lg"
			variant="outline"
			onChange={() => {
				const path = `question.${questionIndex}.correct_answer` as const
				setValue(path, optionIndex)
				clearErrors(path)
			}}
			name={`option.${questionIndex}`}
			aria-label="Definir como a resposta correta"
			title={optionError || "Definir como a resposta correta"}
			error={!!optionError}
		/>

		<TextInput
			size="md"
			className="flex-grow"
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
			className="flex-shrink-0"
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
