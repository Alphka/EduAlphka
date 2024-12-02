import type { ExamFormData } from ".."
import {
	useFieldArray,
	useWatch,
	type Control,
	type FieldErrors,
	type UseFieldArrayRemove,
	type UseFormClearErrors,
	type UseFormRegister,
	type UseFormSetValue
} from "react-hook-form"
import { ActionIcon, Button, Select, Textarea, TextInput, Title } from "@mantine/core"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { MdOutlineDeleteForever } from "react-icons/md"
import { QuestionTypes } from "@models/Exam"
import OptionContainer from "./OptionContainer"

export interface QuestionContainerProps {
	removeQuestion: UseFieldArrayRemove
	clearErrors: UseFormClearErrors<ExamFormData>
	register: UseFormRegister<ExamFormData>
	setValue: UseFormSetValue<ExamFormData>
	control: Control<ExamFormData, any>
	errors: FieldErrors<ExamFormData>
	index: number
}

export default function QuestionContainer({
	removeQuestion,
	clearErrors,
	register,
	setValue,
	control,
	errors,
	index
}: QuestionContainerProps){
	const {
		fields: options,
		append: appendOption,
		remove: removeOption
	} = useFieldArray({
		control,
		name: `question.${index}.option`
	})

	const questionType = (useWatch({
		name: `question.${index}.question_type`,
		defaultValue: "",
		control
	}) || null) as keyof typeof QuestionTypes | null

	return <>
		<div className="flex items-start gap-xs">
			<Title
				className="flex-grow"
				order={3}
				size="lg"
				fw={500}
			>
				Questão {index + 1}
			</Title>

			<ActionIcon
				size="md"
				variant="subtle"
				className="flex-shrink-0"
				aria-label={`Remover ${index + 1}ª questão`}
				title="Remover questão"
				onClick={() => {
					removeQuestion(index)
				}}
				disabled={index === 0}
			>
				<MdOutlineDeleteForever className="text-[1.25rem]" />
			</ActionIcon>
		</div>

		<TextInput
			size="md"
			type="text"
			label="Título da questão"
			placeholder="Título da questão"
			aria-label="Título da questão"
			autoComplete="off"
			{...register(`question.${index}.title`, {
				minLength: {
					value: ExamFormValidation.questionTitleMinLength,
					message: `O título da questão deve ter no mínimo ${ExamFormValidation.questionTitleMinLength} caracteres`
				},
				maxLength: {
					value: ExamFormValidation.questionTitleMaxLength,
					message: `O título da questão deve ter no máximo ${ExamFormValidation.questionTitleMaxLength} caracteres`
				},
				pattern: {
					value: new RegExp(GenericFormValidation.validDescriptionPattern),
					message: "O título da questão contém caracteres inválidos"
				},
				required: {
					value: true,
					message: "O título da questão é obrigatório"
				}
			})}
			error={errors.question?.[index]?.title?.message}
			withAsterisk
		/>

		<div className="flex flex-col gap-md">
			<Select
				size="md"
				label="Selecione o tipo da questão"
				placeholder="Selecione uma opção"
				aria-label="Tipo da questão"
				data={Object.entries(QuestionTypes).map(([value, label]) => ({
					label,
					value
				}))}
				{...register(`question.${index}.question_type`, {
					required: {
						value: true,
						message: "O tipo da questão é obrigatório"
					}
				})}
				onChange={value => {
					setValue(`question.${index}.question_type`, value || "")
				}}
				error={errors.question?.[index]?.question_type?.message}
				withAsterisk
			/>

			{questionType && (questionType === "multiple_choice" ? <>
				<ul className="flex flex-col gap-md">
					{options.map(({ id }, optionIndex, { length }) => {
						return (
							<li className="flex items-center justify-between gap-sm" key={id}>
								<OptionContainer
									questionIndex={index}
									canDelete={length === 1}
									{...{
										removeOption,
										optionIndex,
										clearErrors,
										register,
										setValue,
										control,
										errors
									}}
								/>
							</li>
						)
					})}
				</ul>

				<div className="flex justify-center">
					<Button
						variant="subtle"
						aria-label={`Adicionar opção de múltipla escolha à ${index}ª questão`}
						onClick={() => {
							appendOption({ text: "" })
						}}
					>
						Adicionar opção
					</Button>
				</div>
			</> : (
				<Textarea
					size="md"
					minRows={4}
					maxRows={12}
					placeholder="Conteúdo da questão"
					{...register(`question.${index}.text`, {
						required: {
							value: true,
							message: "O conteúdo da opção é obrigatório"
						}
					})}
					autosize
				/>
			))}
		</div>
	</>
}
