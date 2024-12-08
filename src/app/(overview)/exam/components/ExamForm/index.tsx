"use client"

import type { QuestionTypes } from "@models/Exam"
import type { z } from "zod"
import type questionSchema from "@schemas/question"
import type optionSchema from "@schemas/option"
import type examSchema from "@schemas/exam"
import { ActionIcon, Button, Divider, Fieldset, Textarea, TextInput } from "@mantine/core"
import { useFieldArray, useForm, type DefaultValues } from "react-hook-form"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { useCallback, useRef, type ChangeEvent } from "react"
import { useMediaQuery } from "@mantine/hooks"
import { MdAccessTime } from "react-icons/md"
import { useParams } from "next/navigation"
import { TimeInput } from "@mantine/dates"
import { twJoin } from "tailwind-merge"
import useServerActionHandler from "@hooks/useServerActionHandler"
import formatTimeDuration from "@helpers/formatTimeDuration"
import getDurationMinutes from "@helpers/getDurationMinutes"
import QuestionContainer from "./components/QuestionContainer"
import createExamAction from "../../actions/createExam"
import editExamAction from "../../actions/editExam"

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
	const isMobile = useMediaQuery("(max-width: 600px)")

	const {
		watch,
		control,
		register,
		setValue,
		setError,
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

	const handleDurationChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const { target: { value } } = event

		if(value){
			const duration = getDurationMinutes(value)

			if(duration > ExamFormValidation.maxDurationInMinutes){
				setError("exam.duration", {
					message: `A duração do teste deve ser no máximo ${formatTimeDuration(ExamFormValidation.maxDurationInMinutes)}`,
					type: "max"
				})

				return
			}else if(duration < ExamFormValidation.minDurationInMinutes){
				setError("exam.duration", {
					message: `A duração do teste deve ser no mínimo ${formatTimeDuration(ExamFormValidation.minDurationInMinutes)}`,
					type: "min"
				})

				return
			}

			clearErrors("exam.duration")
		}

		setValue("exam.duration", value, {
			shouldValidate: true
		})
	}, [clearErrors, setError, setValue])

	return (
		<form
			className="flex flex-col gap-3xl"
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
		>
			<Fieldset
				legend="Informações do teste"
				radius="md"
			>
				<div className="flex flex-col gap-md">
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
						defaultValue={watch("exam.title")}
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
						defaultValue={watch("exam.description")}
						error={errors.exam?.description?.message}
						disabled={loading}
						withAsterisk
						autosize
					/>

					<div
						className={twJoin(
							"flex items-start gap-md",
							isMobile && "flex-col items-stretch"
						)}
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
							defaultValue={watch("exam.subject")}
							error={errors.exam?.subject?.message}
							disabled={loading}
						/>

						<TimeInput
							className={twJoin(!isMobile && "basis-1/5")}
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
								onBlur: handleDurationChange,
								onChange: handleDurationChange,
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
					</div>
				</div>
			</Fieldset>

			<Divider />

			<Fieldset
				legend="Questões"
				radius="md"
			>
				<ul className="flex flex-col gap-3xl">
					{questionFields.map(({ id }, index, { length }) => (
						<div
							className={twJoin(
								"relative flex flex-col gap-md",
								index !== length - 1 && [
									"after:w-full after:absolute after:h-0.5 after:left-0 after:right-0 after:-bottom-4",
									"after:translate-y-1/2",
									"after:bg-[var(--mantine-color-default-border)]"
								]
							)}
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
						</div>
					))}
				</ul>

				<Divider my="lg" color="gray" />

				<div className="flex justify-center">
					<Button
						variant="default"
						onClick={() => {
							appendQuestion(defaultExamData)
						}}
						disabled={loading || questionFields.length === ExamFormValidation.maxQuestionsNumber}
					>
						Adicionar questão
					</Button>
				</div>
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
		</form>
	)
}
