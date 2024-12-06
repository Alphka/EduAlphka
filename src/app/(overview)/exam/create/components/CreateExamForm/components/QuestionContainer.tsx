import type { ExamFormData } from ".."
import {
	useFieldArray,
	useWatch,
	type Control,
	type FieldErrors,
	type UseFieldArrayRemove,
	type UseFormClearErrors,
	type UseFormRegister,
	type UseFormSetValue,
	type UseFormWatch
} from "react-hook-form"
import { ActionIcon, Button, Group, Select, Stack, Switch, Textarea, Title } from "@mantine/core"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { MdOutlineDeleteForever } from "react-icons/md"
import { QuestionTypes } from "@models/Exam"
import OptionContainer from "./OptionContainer"

const defaultQuestionOption: NonNullable<ExamFormData["question"][number]["option"]>[number] = {
	text: ""
}

export interface QuestionContainerProps {
	removeQuestion: UseFieldArrayRemove
	clearErrors: UseFormClearErrors<ExamFormData>
	canDelete: boolean
	register: UseFormRegister<ExamFormData>
	setValue: UseFormSetValue<ExamFormData>
	control: Control<ExamFormData, any>
	errors: FieldErrors<ExamFormData>
	watch: UseFormWatch<ExamFormData>
	index: number
}

export default function QuestionContainer({
	removeQuestion,
	clearErrors,
	canDelete,
	register,
	setValue,
	control,
	errors,
	watch,
	index
}: QuestionContainerProps){
	const {
		fields: optionFields,
		append: appendOption,
		remove: removeOption
	} = useFieldArray({
		control,
		name: `question.${index}.option`
	})

	const questionType = (useWatch({
		name: `question.${index}.question_type`,
		defaultValue: "" as keyof typeof QuestionTypes,
		control
	}) || null) as keyof typeof QuestionTypes | null

	return <>
		<Group gap="xs">
			<Stack
				flex={1}
				gap="md"
			>
				<Title
					order={3}
					flex={1}
					fz="lg"
					fw={500}
				>
					Questão {index + 1}
				</Title>

				<Switch
					size="xs"
					radius="xl"
					color="blue"
					label="Questão obrigatória"
					labelPosition="right"
					{...register(`question.${index}.required`)}
					defaultChecked
				/>
			</Stack>

			<ActionIcon
				size="md"
				color="blue"
				radius="sm"
				variant="light"
				className="shrink-0"
				aria-label={`Remover ${index + 1}ª questão`}
				title="Remover questão"
				onClick={() => {
					removeQuestion(index)
				}}
				disabled={!canDelete}
			>
				<MdOutlineDeleteForever className="text-[1.25rem]" />
			</ActionIcon>
		</Group>

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
				required: {
					value: true,
					message: "O conteúdo da questão é obrigatório"
				}
			})}
			error={errors.question?.[index]?.text?.message}
			withAsterisk
			spellCheck
			autosize
		/>

		<Stack gap="md">
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
					setValue(`question.${index}.question_type`, (value || "") as keyof typeof QuestionTypes)
				}}
				error={errors.question?.[index]?.question_type?.message}
				allowDeselect={false}
				clearable={false}
				withAsterisk
			/>

			{questionType && questionType === "multiple_choice" && <>
				<Stack gap="md">
					{optionFields.map(({ id }, optionIndex, { length }) => {
						const path = `question.${index}.correct_answer` as const

						return (
							<Group
								justify="space-between"
								gap="sm"
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
											required: {
												value: true,
												message: "Nenhuma opção foi selecionada como a resposta correta"
											}
										})}
										name={undefined}
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
										register,
										setValue,
										errors,
										watch
									}}
								/>
							</Group>
						)
					})}
				</Stack>

				<Group justify="center">
					<Button
						size="sm"
						variant="subtle"
						aria-label={`Adicionar opção de múltipla escolha à ${index}ª questão`}
						onClick={() => {
							appendOption(defaultQuestionOption)
						}}
						disabled={optionFields.length === ExamFormValidation.maxOptionsNumber}
					>
						Adicionar opção
					</Button>
				</Group>
			</>}
		</Stack>
	</>
}
