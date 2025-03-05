import type { ExamFormData } from ".."
import {
	useFieldArray,
	type Control,
	type FieldErrors,
	type UseFieldArrayRemove,
	type UseFormClearErrors,
	type UseFormRegister,
	type UseFormSetValue,
	type UseFormWatch
} from "react-hook-form"
import { ActionIcon, Button, Select, Switch, Textarea, Title } from "@mantine/core"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { MdOutlineDeleteForever } from "react-icons/md"
import { useMediaQuery } from "@mantine/hooks"
import { QuestionTypes } from "@models/Exam"
import OptionContainer from "./OptionContainer"

const defaultQuestionOption: NonNullable<ExamFormData["question"][number]["option"]>[number] = {
	text: ""
}

export interface QuestionContainerProps {
	removeQuestion: UseFieldArrayRemove
	clearErrors: UseFormClearErrors<ExamFormData>
	canDelete: boolean
	disabled?: boolean
	register: UseFormRegister<ExamFormData>
	setValue: UseFormSetValue<ExamFormData>
	control: Control<ExamFormData>
	errors: FieldErrors<ExamFormData>
	watch: UseFormWatch<ExamFormData>
	index: number
}

export default function QuestionContainer({
	removeQuestion,
	clearErrors,
	canDelete,
	disabled,
	register,
	setValue,
	control,
	errors,
	watch,
	index
}: QuestionContainerProps){
	const isMobile = useMediaQuery("not all and (min-width: 400px)")

	const {
		fields: optionFields,
		append: appendOption,
		remove: removeOption
	} = useFieldArray({
		control,
		name: `question.${index}.option`
	})

	return <>
		<section className="flex items-start gap-xs">
			<header className="flex-grow flex flex-col gap-md">
				<Title
					order={1}
					flex={1}
					fz="lg"
					fw={500}
				>
					Questão {index + 1}
				</Title>

				<Switch
					size="md"
					radius="xl"
					color="blue"
					label={isMobile ? "Obrigatória" : "Questão obrigatória"}
					labelPosition="right"
					{...register(`question.${index}.required`)}
					defaultChecked={watch(`question.${index}.required`)}
				/>
			</header>

			<ActionIcon
				size="md"
				color="blue"
				radius="sm"
				variant="light"
				className="shrink-0"
				aria-label={`Remover ${index + 1}ª questão`}
				title="Remover questão"
				onClick={() => removeQuestion(index)}
				disabled={disabled || !canDelete}
			>
				<MdOutlineDeleteForever className="text-[1.25rem]" />
			</ActionIcon>
		</section>

		<Textarea
			size="md"
			minRows={2}
			maxRows={12}
			label="Pergunta"
			placeholder="Conteúdo da questão"
			aria-label="Conteúdo da questão"
			autoComplete="off"
			{...register(`question.${index}.text`, {
				minLength: {
					value: ExamFormValidation.questionTextMinLength,
					message: `O conteúdo da questão deve ter no mínimo ${ExamFormValidation.questionTextMinLength} caracteres`
				},
				maxLength: {
					value: ExamFormValidation.questionTextMaxLength,
					message: `O conteúdo da questão deve ter no máximo ${ExamFormValidation.questionTextMaxLength} caracteres`
				},
				pattern: {
					value: new RegExp(GenericFormValidation.validDescriptionPattern),
					message: "O conteúdo da questão contém caracteres inválidos"
				},
				required: "O conteúdo da questão é obrigatório"
			})}
			defaultValue={watch(`question.${index}.text`)}
			error={errors.question?.[index]?.text?.message}
			withAsterisk
			spellCheck
			autosize
		/>

		<div className="flex flex-col gap-md">
			<Select
				size="md"
				label="Selecione o tipo da questão"
				placeholder="Selecione uma opção"
				aria-label="Tipo da questão"
				data={Object.entries(QuestionTypes).map(([value, label]) => ({ label, value }))}
				{...register(`question.${index}.question_type`, {
					required: "O tipo da questão é obrigatório"
				})}
				defaultValue={watch(`question.${index}.question_type`) || null}
				onChange={value => {
					setValue(`question.${index}.question_type`, (value || "") as keyof typeof QuestionTypes)
				}}
				error={errors.question?.[index]?.question_type?.message}
				allowDeselect={false}
				clearable={false}
				withAsterisk
			/>

			{watch(`question.${index}.question_type`) === "multiple_choice" && <>
				<ul className="flex flex-col gap-md">
					{optionFields.map(({ id }, optionIndex, { length }) => {
						const path = `question.${index}.correct_answer` as const

						return (
							<li
								className="flex items-center justify-between gap-sm"
								key={id}
							>
								{optionIndex === 0 && (
									<input
										type="text"
										className="sr-only"
										aria-hidden
										tabIndex={-1}
										onFocus={() => {
											const options = document.getElementsByName(path)
											options[0]?.focus()
										}}
										{...register(path, {
											required: "Nenhuma opção foi selecionada como a resposta correta"
										})}
										name={undefined}
										defaultValue={watch(path)}
									/>
								)}

								<OptionContainer
									questionIndex={index}
									defaultOption={defaultQuestionOption}
									canDelete={length !== 1}
									{...{
										removeOption,
										appendOption,
										optionIndex,
										clearErrors,
										disabled,
										register,
										setValue,
										errors,
										watch
									}}
								/>
							</li>
						)
					})}
				</ul>

				<div className="flex justify-center">
					<Button
						size="sm"
						variant="subtle"
						onClick={() => appendOption(defaultQuestionOption)}
						aria-label={`Adicionar opção de múltipla escolha à ${index}ª questão`}
						disabled={disabled || optionFields.length === ExamFormValidation.maxOptionsNumber}
					>
						Adicionar opção
					</Button>
				</div>
			</>}
		</div>
	</>
}
