"use client"

import type { QuestionTypes } from "@models/Exam"
import type { z } from "zod"
import type questionSchema from "@schemas/question"
import type optionSchema from "@schemas/option"
import type examSchema from "@schemas/exam"
import { ActionIcon, Button, Divider, Fieldset, Textarea, TextInput } from "@mantine/core"
import { useFieldArray, useForm, type DefaultValues } from "react-hook-form"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { DateTimePicker, TimeInput, type DateValue } from "@mantine/dates"
import { useCallback, useRef, type ChangeEvent } from "react"
import { MdAccessTime, MdSettings } from "react-icons/md"
import { useMediaQuery } from "@mantine/hooks"
import { twJoin } from "tailwind-merge"
import useServerActionHandler from "@hooks/useServerActionHandler"
import formatTimeDuration from "@helpers/formatTimeDuration"
import getDurationMinutes from "@helpers/getDurationMinutes"
import QuestionContainer from "./components/QuestionContainer"
import createExamAction from "../../actions/createExam"
import editExamAction from "../../actions/editExam"
import routes from "@app/routes"
import Link from "next/link"

export interface ExamFormData {
	exam: Omit<z.infer<typeof examSchema>, "questions">
	question: (Omit<z.infer<typeof questionSchema>, "type" | "options"> & {
		question_type: keyof typeof QuestionTypes
		option: z.infer<typeof optionSchema>[]
	})[]
}

const defaultQuestionData: ExamFormData["question"][number] = {
	question_type: "" as keyof typeof QuestionTypes,
	text: "",
	option: [{ text: "" }],
	required: true
}

type ExamFormProps = {
	defaultValues?: DefaultValues<ExamFormData>
	canEdit?: boolean
	loading?: boolean
	examId?: string
} & ({
	examId?: undefined
	type?: "create"
} | {
	examId: string
	type: "edit"
})

export default function ExamForm({
	defaultValues,
	canEdit,
	loading,
	examId,
	type = "create"
}: ExamFormProps){
	const { handleServerAction, isPending } = useServerActionHandler()
	const durationInputRef = useRef<HTMLInputElement>(null)
	const isMobile = useMediaQuery("(max-width: 600px)")

	const formDisabled = loading || canEdit === false

	const {
		watch,
		control,
		setValue,
		register,
		setError,
		getValues,
		clearErrors,
		handleSubmit,
		formState: { errors }
	} = useForm<ExamFormData>({
		reValidateMode: "onChange",
		defaultValues: defaultValues || {
			question: [defaultQuestionData]
		},
		disabled: formDisabled,
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

	const handleStartsAtChange = useCallback((value: DateValue) => {
		if(value){
			clearErrors("exam.startsAt")
		}

		setValue("exam.startsAt", value ? new Date(value) : undefined, {
			shouldValidate: true
		})
	}, [clearErrors, setValue])

	const handleExpiresAtChange = useCallback((value: DateValue) => {
		if(value){
			clearErrors("exam.expiresAt")
		}

		setValue("exam.expiresAt", value ? new Date(value) : undefined, {
			shouldValidate: true
		})
	}, [clearErrors, setValue])

	const examDuration = register("exam.duration", {
		onBlur: handleDurationChange,
		onChange: handleDurationChange,
		required: "A duração do teste é obrigatória"
	})

	examDuration.ref(durationInputRef.current)

	return (
		<div className="flex flex-col gap-2xl">
			<header className="flex justify-end flex-wrap-reverse gap-md">
				<h1 className="flex-grow text-4xl font-bold">
					{type === "edit" ? defaultValues?.exam?.title : "Criar teste"}
				</h1>

				{!loading && type === "edit" && (
					<Button
						className="flex-shrink-0"
						href={routes.exam.children.template.children.manage.pathname.replace("[id]", examId as string)}
						variant="filled"
						component={Link}
						leftSection={<MdSettings className="text-lg" />}
					>
						Gerenciar teste
					</Button>
				)}
			</header>

			<Divider />

			<form
				className="flex flex-col gap-3xl"
				onSubmit={handleSubmit(async ({
					exam,
					question
				}) => {
					const examData = {
						...exam,
						subject: exam.subject || undefined,
						startsAt: exam.startsAt || undefined,
						expiresAt: exam.expiresAt || undefined,
						questions: question.map(({
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
					}

					await handleServerAction(type === "create"
						? createExamAction(examData)
						: editExamAction(examId as string, examData)
					)
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
								required: "O título do teste é obrigatório"
							})}
							defaultValue={watch("exam.title")}
							error={errors.exam?.title?.message}
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
								required: "A descrição do teste é obrigatória"
							})}
							defaultValue={watch("exam.description")}
							error={errors.exam?.description?.message}
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
								className="flex-grow"
								size="md"
								type="text"
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
										value: new RegExp(ExamFormValidation.validSubjectPattern),
										message: "O nome da disciplina contém caracteres inválidos"
									}
								})}
								defaultValue={watch("exam.subject")}
								error={errors.exam?.subject?.message}
							/>

							<TimeInput
								className={twJoin(!isMobile && "basis-1/5")}
								size="md"
								label="Duração"
								aria-label="Duração do teste"
								classNames={{
									input: "[&::-webkit-calendar-picker-indicator]:hidden"
								}}
								rightSection={(
									<ActionIcon
										color={errors.exam?.duration ? "currentColor" : "gray"}
										variant="subtle"
										onClick={event => {
											if(!event.currentTarget.disabled){
												durationInputRef.current?.showPicker?.()
											}
										}}
										aria-label="Escolha o horário"
										disabled={formDisabled || getValues("exam.duration") === undefined}
									>
										<MdAccessTime className="text-[1.25rem]" />
									</ActionIcon>
								)}
								{...examDuration}
								minTime={formatTimeDuration(ExamFormValidation.minDurationInMinutes)}
								maxTime={formatTimeDuration(ExamFormValidation.maxDurationInMinutes)}
								defaultValue={watch("exam.duration")}
								error={errors.exam?.duration?.message}
								ref={durationInputRef}
								withAsterisk
							/>
						</div>

						<div
							className={twJoin(
								"flex items-start gap-md",
								isMobile && "flex-col items-stretch"
							)}
						>
							<DateTimePicker
								className={twJoin(!isMobile && "flex-grow")}
								size="md"
								label="Data de início"
								placeholder="Data de início do teste"
								aria-label="Data de início do teste"
								{...register("exam.startsAt", {
									onChange: undefined,
									onBlur: undefined
								})}
								onChange={handleStartsAtChange}
								minDate={new Date}
								maxDate={watch("exam.expiresAt")}
								defaultValue={watch("exam.startsAt")}
								error={errors.exam?.startsAt?.message}
							/>

							<DateTimePicker
								className={twJoin(!isMobile && "flex-grow")}
								size="md"
								label="Data de expiração"
								placeholder="Data de expiração do teste"
								aria-label="Data de expiração do teste"
								{...register("exam.expiresAt", {
									onChange: undefined,
									onBlur: undefined
								})}
								onChange={handleExpiresAtChange}
								minDate={watch("exam.startsAt") || new Date}
								defaultValue={watch("exam.expiresAt")}
								error={errors.exam?.expiresAt?.message}
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
										"after:bg-dark-400"
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
									disabled={formDisabled}
								/>
							</div>
						))}
					</ul>

					<Divider my="lg" color="gray" />

					<div className="flex justify-center">
						<Button
							variant="default"
							onClick={() => {
								appendQuestion(defaultQuestionData)
							}}
							disabled={formDisabled || questionFields.length === ExamFormValidation.maxQuestionsNumber}
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
					disabled={formDisabled}
				>
					{type === "edit" ? "Editar teste" : "Cadastrar teste"}
				</Button>
			</form>
		</div>
	)
}
