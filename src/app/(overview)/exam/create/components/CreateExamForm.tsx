"use client"

import type { UUID } from "crypto"
import { ActionIcon, Button, Divider, Fieldset, Select, Textarea, TextInput, Title } from "@mantine/core"
import { useRef, useState, type ChangeEvent, type FocusEvent } from "react"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { MdAccessTime, MdOutlineDeleteForever } from "react-icons/md"
import { QuestionTypes } from "@models/Exam"
import { v4 as uuid } from "uuid"
import { TimeInput } from "@mantine/dates"
import { useForm } from "react-hook-form"
import formatTimeDuration from "@helpers/formatTimeDuration"

interface Question {
	id: UUID
}

const newQuestion = () => ({
	id: uuid()
} as Question)

export default function CreateExamForm(){
	const [questions, setQuestions] = useState<Question[]>(() => [newQuestion()])
	const durationInputRef = useRef<HTMLInputElement>(null)

	const {
		setValue,
		register,
		unregister,
		handleSubmit,
		formState: { errors }
	} = useForm<{
		exam_title: string
		exam_description: string
		exam_subject?: string
		exam_duration: string
		question_title: string[]
		question_type: string[]
	}>({
		mode: "onBlur"
	})

	return (
		<form onSubmit={handleSubmit(() => {})}>
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
						{...register("exam_title", {
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
						error={errors.exam_title?.message}
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
						{...register("exam_description", {
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
						error={errors.exam_description?.message}
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
							{...register("exam_subject", {
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
							error={errors.exam_subject?.message}
						/>

						<TimeInput
							className="basis-1/5"
							size="md"
							label="Duração"
							aria-label="Duração do teste"
							rightSection={(
								<ActionIcon
									color={errors.exam_duration ? "currentColor" : "gray"}
									variant="subtle"
									onClick={() => durationInputRef.current?.showPicker?.()}
								>
									<MdAccessTime className="text-xl" />
								</ActionIcon>
							)}
							minTime={formatTimeDuration(ExamFormValidation.minDurationInMinutes)}
							maxTime={formatTimeDuration(ExamFormValidation.maxDurationInMinutes)}
							{...register("exam_duration", {
								onBlur(event: FocusEvent<HTMLInputElement>){
									const { target: input } = event
									const value = input.value === "00:00" ? "" : input.value

									setValue("exam_duration", value, {
										shouldDirty: true,
										shouldValidate: true
									})
								},
								onChange(event: ChangeEvent<HTMLInputElement>){
									const { target: input } = event
									const value = input.value === "00:00" ? "" : input.value

									setValue("exam_duration", value, {
										shouldValidate: true
									})
								},
								required: {
									value: true,
									message: "A duração do teste é obrigatória"
								}
							})}
							error={errors.exam_duration?.message}
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
					{questions.map(({ id }, index) => (
						<li
							className="flex flex-col gap-md"
							key={id}
						>
							<div className="relative">
								<Title order={3} fw={500} size="lg">
									Questão {index + 1}
								</Title>

								<ActionIcon
									variant="subtle"
									className="absolute top-0 bottom-0 right-0"
									aria-label={`Remover ${index + 1}ª questão`}
									title="Remover questão"
									onClick={() => {
										unregister(`question_title.${index}`)
										unregister(`question_type.${index}`)

										setQuestions(questions => [
											...questions.slice(0, index),
											...questions.slice(index + 1)
										])
									}}
									disabled={index === 0}
								>
									<MdOutlineDeleteForever />
								</ActionIcon>
							</div>

							<TextInput
								size="md"
								type="text"
								label="Título da questão"
								placeholder="Título da questão"
								aria-label="Título da questão"
								autoComplete="off"
								{...register(`question_title.${index}`, {
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
								error={errors.question_title?.[index]?.message}
								withAsterisk
							/>

							<Select
								size="md"
								label="Selecione o tipo da questão"
								placeholder="Selecione uma opção"
								aria-label="Tipo da questão"
								data={Object.entries(QuestionTypes).map(([value, label]) => ({
									label,
									value
								}))}
								{...register(`question_type.${index}`, {
									required: {
										value: true,
										message: "O tipo da questão é obrigatório"
									}
								})}
								onChange={value => {
									setValue(`question_type.${index}`, value || "")
								}}
								error={errors.question_type?.[index]?.message}
								withAsterisk
							/>
						</li>
					))}
				</ul>

				<Divider my="lg" color="gray" />

				<div className="flex justify-center">
					<Button
						variant="default"
						onClick={() => {
							setQuestions(questions => questions.concat(newQuestion()))
						}}
					>
						Adicionar questão
					</Button>
				</div>
			</Fieldset>

			<Button
				type="submit"
				variant="filled"
				mt="xl"
			>
				Cadastrar teste
			</Button>
		</form>
	)
}
