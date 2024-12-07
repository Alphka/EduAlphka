"use client"

import type { QuestionTypes } from "@models/Exam"
import type { z } from "zod"
import type questionSchema from "@schemas/question"
import type optionSchema from "@schemas/option"
import type examSchema from "@schemas/exam"
import { ActionIcon, Button, Divider, Fieldset, Group, Stack, Textarea, TextInput } from "@mantine/core"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { useRef, type ChangeEvent, type FocusEvent } from "react"
import { useFieldArray, useForm, type DefaultValues } from "react-hook-form"
import { MdAccessTime } from "react-icons/md"
import { TimeInput } from "@mantine/dates"
import { twJoin } from "tailwind-merge"
import useServerActionHandler from "@hooks/useServerActionHandler"
import formatTimeDuration from "@helpers/formatTimeDuration"
import QuestionContainer from "./components/QuestionContainer"
import createExamAction from "../../actions/createExam"
import editExamAction from "../../actions/editExam"
import { useParams } from "next/navigation"

export interface ExamFormData {
	exam: Omit<z.infer<typeof examSchema>, "questions">
	question: (Omit<z.infer<typeof questionSchema>, "type" | "options"> & {
		question_type: keyof typeof QuestionTypes
		option: z.infer<typeof optionSchema>[]
	})[]
}

const defaultExamData: ExamFormData["question"][number] = {
	question_type: "" as keyof typeof QuestionTypes,
	text: "",
	option: [{ text: "" }],
	required: false
}

interface ExamFormProps {
	/** @default "create" */
	type?: "create" | "edit"
	loading?: boolean
	defaultValues?: DefaultValues<ExamFormData>
}

export default function ExamForm({
	type,
	loading,
	defaultValues
}: ExamFormProps){
	const { id } = useParams()
	const { isPending, handleServerAction } = useServerActionHandler()
	const durationInputRef = useRef<HTMLInputElement>(null)

	const {
		watch,
		control,
		setValue,
		register,
		clearErrors,
		handleSubmit,
		formState: { errors }
	} = useForm<ExamFormData>({
		reValidateMode: "onChange",
		defaultValues: defaultValues || {
			question: [defaultExamData]
		},
		mode: "onSubmit"
	})

	const {
		fields: questionFields,
		append: appendQuestion,
		remove: removeQuestion
	} = useFieldArray({
		control,
		name: "question"
	})

	return (
		<Stack
			onSubmit={handleSubmit(({
				exam: {
					title,
					description,
					subject,
					duration
				},
				question
			}) => {
				const questions = question.map(({
					question_type: type,
					option: options,
					correct_answer,
					...questionData
				}) => ({
					type,
					...(type === "multiple_choice" ? {
						options,
						correct_answer
					} : undefined),
					...questionData
				}))

				const promise = type === "create"
					? createExamAction({
						title,
						subject,
						duration,
						questions,
						description
					})
					: editExamAction(id as string, {
						title,
						subject,
						duration,
						questions,
						description
					})

				handleServerAction(promise)
			})}
			component="form"
			gap="3xl"
		>
			<Fieldset
				legend="Informações do teste"
				radius="md"
			>
				<Stack gap="md">
					<TextInput
						size="md"
						type="text"
						label="Título do teste"
						placeholder="Título do teste"
						aria-label="Título do teste"
						autoComplete="off"
						{...register("exam.title", {
							minLength: {
								value: ExamFormValidation.titleMinLength,
								message: `O título do teste deve ter no mínimo ${ExamFormValidation.titleMinLength} caracteres`
							},
							maxLength: {
								value: ExamFormValidation.titleMaxLength,
								message: `O título do teste deve ter no máximo ${ExamFormValidation.titleMaxLength} caracteres`
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validSpecialNamePattern),
								message: "O título do teste contém caracteres inválidos"
							},
							required: {
								value: true,
								message: "O título do teste é obrigatório"
							}
						})}
						error={errors.exam?.title?.message}
						disabled={loading}
						withAsterisk
					/>

					<Textarea
						size="md"
						minRows={2}
						maxRows={12}
						label="Descrição"
						placeholder="Descrição do teste"
						aria-label="Descrição do teste"
						autoComplete="off"
						{...register("exam.description", {
							minLength: {
								value: ExamFormValidation.descriptionMinLength,
								message: `A descrição do teste deve ter no mínimo ${ExamFormValidation.descriptionMinLength} caracteres`
							},
							maxLength: {
								value: ExamFormValidation.descriptionMaxLength,
								message: `A descrição do teste deve ter no máximo ${ExamFormValidation.descriptionMaxLength} caracteres`
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validDescriptionPattern),
								message: "A descrição do teste contém caracteres inválidos"
							},
							required: {
								value: true,
								message: "A descrição do teste é obrigatória"
							}
						})}
						error={errors.exam?.description?.message}
						disabled={loading}
						withAsterisk
						autosize
					/>

					<Group
						align="flex-start"
						gap="md"
					>
						<TextInput
							size="md"
							type="text"
							flex={1}
							label="Disciplina"
							placeholder="Disciplina do teste"
							aria-label="Disciplina do teste"
							autoComplete="off"
							minLength={ExamFormValidation.subjectMinLength}
							maxLength={ExamFormValidation.subjectMaxLength}
							{...register("exam.subject", {
								minLength: {
									value: ExamFormValidation.subjectMinLength,
									message: `O nome da disciplina deve ter no mínimo ${ExamFormValidation.subjectMinLength} caracteres`
								},
								maxLength: {
									value: ExamFormValidation.subjectMaxLength,
									message: `O nome da disciplina deve ter no máximo ${ExamFormValidation.subjectMaxLength} caracteres`
								},
								pattern: {
									value: new RegExp(GenericFormValidation.validSpecialNamePattern),
									message: "O nome da disciplina contém caracteres inválidos"
								}
							})}
							error={errors.exam?.subject?.message}
							disabled={loading}
						/>

						<TimeInput
							className="basis-1/5"
							size="md"
							label="Duração"
							aria-label="Duração do teste"
							rightSection={(
								<ActionIcon
									color={errors.exam?.duration ? "currentColor" : "gray"}
									variant="subtle"
									aria-label="Escolha o horário"
									onClick={event => {
										if(!event.currentTarget.disabled){
											durationInputRef.current?.showPicker?.()
										}
									}}
									disabled={loading}
								>
									<MdAccessTime className="text-[1.25rem]" />
								</ActionIcon>
							)}
							minTime={formatTimeDuration(ExamFormValidation.minDurationInMinutes)}
							maxTime={formatTimeDuration(ExamFormValidation.maxDurationInMinutes)}
							{...register("exam.duration", {
								onBlur(event: FocusEvent<HTMLInputElement>){
									const { target: input } = event
									const value = input.value === "00:00" ? "" : input.value

									setValue("exam.duration", value, {
										shouldDirty: true,
										shouldValidate: true
									})
								},
								onChange(event: ChangeEvent<HTMLInputElement>){
									const { target: input } = event
									const value = input.value === "00:00" ? "" : input.value

									setValue("exam.duration", value, {
										shouldValidate: true
									})
								},
								required: {
									value: true,
									message: "A duração do teste é obrigatória"
								}
							})}
							defaultValue={watch("exam.duration")}
							error={errors.exam?.duration?.message}
							ref={durationInputRef}
							disabled={loading}
							withAsterisk
						/>
					</Group>
				</Stack>
			</Fieldset>

			<Divider />

			<Fieldset
				legend="Questões"
				radius="md"
			>
				<Stack
					component="ul"
					gap="3xl"
				>
					{questionFields.map(({ id }, index, { length }) => (
						<Stack
							pos="relative"
							className={twJoin(
								index !== length - 1 && [
									"after:w-full after:absolute after:h-0.5 after:left-0 after:right-0 after:-bottom-4",
									"after:translate-y-1/2",
									"after:bg-[var(--mantine-color-default-border)]"
								]
							)}
							gap="md"
							key={id}
						>
							<QuestionContainer
								canDelete={length !== 1}
								{...{
									removeQuestion,
									clearErrors,
									register,
									setValue,
									control,
									errors,
									watch,
									index
								}}
								disabled={loading}
							/>
						</Stack>
					))}
				</Stack>

				<Divider my="lg" color="gray" />

				<Group justify="center">
					<Button
						variant="default"
						onClick={() => {
							appendQuestion(defaultExamData)
						}}
						disabled={loading || questionFields.length === ExamFormValidation.maxQuestionsNumber}
					>
						Adicionar questão
					</Button>
				</Group>
			</Fieldset>

			<Button
				className="self-start"
				size="sm"
				type="submit"
				variant="filled"
				loading={isPending}
				disabled={loading}
			>
				{type === "create" ? "Cadastrar teste" : "Editar teste"}
			</Button>
		</Stack>
	)
}
