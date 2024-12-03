"use client"

import { ActionIcon, Button, Divider, Fieldset, Textarea, TextInput } from "@mantine/core"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { useRef, type ChangeEvent, type FocusEvent } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { MdAccessTime } from "react-icons/md"
import { TimeInput } from "@mantine/dates"
import { twJoin } from "tailwind-merge"
import createExam, { type ExamData, type QuestionData } from "../../../actions/createExam"
import formatTimeDuration from "@helpers/formatTimeDuration"
import QuestionContainer from "./components/QuestionContainer"

export interface ExamFormData {
	exam: ExamData
	question: (Omit<QuestionData, "type"> & {
		question_type: QuestionData["type"]
	})[]
}

export default function CreateExamForm(){
	const durationInputRef = useRef<HTMLInputElement>(null)

	const {
		control,
		setValue,
		register,
		clearErrors,
		handleSubmit,
		formState: { errors }
	} = useForm<ExamFormData>({
		reValidateMode: "onChange",
		defaultValues: {
			question: [{
				question_type: "",
				text: "",
				option: [{ text: "" }]
			}]
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
		<form
			className="flex flex-col gap-8"
			onSubmit={handleSubmit(({
				exam: {
					title,
					description,
					subject,
					duration
				},
				question: questions
			}) => {
				createExam({
					title,
					description,
					subject,
					duration
				}, questions.map(({ question_type, ...questionData }) => ({
					type: question_type,
					...questionData
				})))
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
						placeholder="Descrição do teste"
						aria-label="Descrição do teste"
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
								message: `A descrição do teste deve ter no mínimo ${ExamFormValidation.descriptionMinLength} minutos`
							},
							maxLength: {
								value: ExamFormValidation.descriptionMaxLength,
								message: `A descrição do teste deve ter no máximo ${ExamFormValidation.descriptionMaxLength} minutos`
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
						withAsterisk
						autosize
					/>

					<div className="flex gap-md">
						<TextInput
							size="md"
							type="text"
							className="flex-grow"
							label="Disciplina"
							placeholder="Disciplina do teste"
							aria-label="Disciplina do teste"
							autoComplete="off"
							{...register("exam.subject", {
								minLength: {
									value: GenericFormValidation.nameMinLength,
									message: `O nome da disciplina deve ter no mínimo ${GenericFormValidation.nameMinLength} caracteres`
								},
								maxLength: {
									value: GenericFormValidation.nameMaxLength,
									message: `O nome da disciplina deve ter no máximo ${GenericFormValidation.nameMaxLength} caracteres`
								},
								pattern: {
									value: new RegExp(GenericFormValidation.validSpecialNamePattern),
									message: "O nome da disciplina contém caracteres inválidos"
								}
							})}
							error={errors.exam?.subject?.message}
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
									onClick={() => durationInputRef.current?.showPicker?.()}
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
							error={errors.exam?.duration?.message}
							ref={durationInputRef}
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
				<ul className="flex flex-col gap-xl">
					{questionFields.map(({ id }, index, { length }) => (
						<li
							className={twJoin(
								"relative flex flex-col gap-md",
								index !== length - 1 && "after:w-full after:bg-[var(--mantine-color-default-border)] after:absolute after:h-0.5 after:left-0 after:right-0 after:-bottom-4 after:translate-y-1/2"
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
									index
								}}
							/>
						</li>
					))}
				</ul>

				<Divider my="lg" color="gray" />

				<div className="flex justify-center">
					<Button
						variant="default"
						onClick={() => {
							appendQuestion({
								text: "",
								question_type: "",
								option: [{ text: "" }]
							})
						}}
					>
						Adicionar questão
					</Button>
				</div>
			</Fieldset>

			<Button
				type="submit"
				size="sm"
				variant="filled"
				className="self-start"
			>
				Cadastrar teste
			</Button>
		</form>
	)
}
