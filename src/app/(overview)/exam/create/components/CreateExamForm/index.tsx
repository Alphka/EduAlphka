"use client"

import { ActionIcon, Button, Divider, Fieldset, Textarea, TextInput } from "@mantine/core"
import { useRef, type ChangeEvent, type FocusEvent } from "react"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { useFieldArray, useForm } from "react-hook-form"
import { MdAccessTime } from "react-icons/md"
import { TimeInput } from "@mantine/dates"
import formatTimeDuration from "@helpers/formatTimeDuration"
import QuestionContainer from "./components/QuestionContainer"

export interface ExamFormData {
	exam: {
		title: string
		description: string
		subject?: string
		duration: string
	}
	question: {
		title: string
		question_type: string
		text?: string
		option?: {
			text: string
		}[]
		/** Option's index */
		correct_answer?: number
	}[]
}

export default function CreateExamForm(){
	const durationInputRef = useRef<HTMLInputElement>(null)

	const {
		control,
		setValue,
		register,
		setError,
		clearErrors,
		handleSubmit,
		formState: { errors }
	} = useForm<ExamFormData>({
		reValidateMode: "onChange",
		defaultValues: {
			question: [{
				title: "",
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
			onSubmit={handleSubmit(({
				question: questions
			}) => {
				let hasError = false

				for(let questionIndex = 0, { length } = questions; questionIndex < length; questionIndex++){
					const question = questions[questionIndex]
					const path = `question.${questionIndex}.correct_answer` as const

					if(typeof question.correct_answer !== "number"){

						setError(path, {
							type: "required",
							message: "Nenhuma opção foi selecionada como a resposta correta",
						})

						hasError = true
					}else{
						clearErrors(path)
					}
				}

				if(hasError) return
			})}
		>
			<Fieldset
				legend="Informações do teste"
				radius="md"
				mb="lg"
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

			<Divider my="xl" />

			<Fieldset
				legend="Questões"
				radius="md"
				mb="lg"
			>
				<ul className="flex flex-col gap-xl">
					{questionFields.map(({ id }, index) => (
						<li className="flex flex-col gap-md" key={id}>
							<QuestionContainer
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
								title: "",
								question_type: "",
								text: "",
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
				variant="filled"
			>
				Cadastrar teste
			</Button>
		</form>
	)
}
