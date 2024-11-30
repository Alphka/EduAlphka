"use client"

import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { ActionIcon, Textarea, TextInput } from "@mantine/core"
import { MdAccessTime } from "react-icons/md"
import { TimeInput } from "@mantine/dates"
import { useForm } from "react-hook-form"
import { useRef } from "react"
import formatTimeDuration from "@helpers/formatTimeDuration"
import Legend from "@app/components/forms/Legend"

export default function CreateExamForm(){
	const durationInputRef = useRef<HTMLInputElement>(null)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<{
		title: string
		description: string
		subject?: string
		duration: number
	}>()

	return (
		<form
			className="flex flex-col gap-10"
			onSubmit={handleSubmit(() => {})}
		>
			<fieldset>
				<Legend>
					Informações do teste
				</Legend>

				<div className="flex flex-col gap-6">
					<TextInput
						size="md"
						type="text"
						label="Título do teste"
						placeholder="Descrição do teste"
						aria-label="Descrição do teste"
						autoComplete="off"
						{...register("title", {
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
							required: true
						})}
						error={errors.title?.message}
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
						{...register("description", {
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
						})}
						error={errors.description?.message}
						withAsterisk
						autosize
					/>

					<div className="flex gap-6">
						<TextInput
							size="md"
							type="text"
							className="flex-grow"
							label="Disciplina"
							placeholder="Disciplina do teste"
							aria-label="Disciplina do teste"
							autoComplete="off"
							{...register("subject", {
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
							error={errors.title?.message}
						/>

						<TimeInput
							size="md"
							className="basis-1/5"
							label="Duração"
							aria-label="Duração do teste"
							step={1}
							rightSection={(
								<ActionIcon
									color="gray"
									variant="subtle"
									onClick={() => durationInputRef.current?.showPicker?.()}
								>
									<MdAccessTime className="text-base" />
								</ActionIcon>
							)}
							minTime={formatTimeDuration(ExamFormValidation.minDurationInMinutes)}
							maxTime={formatTimeDuration(ExamFormValidation.maxDurationInMinutes)}
							{...register("duration", { required: true })}
							error={errors.duration?.message}
							ref={durationInputRef}
							withAsterisk
						/>
					</div>
				</div>
			</fieldset>
		</form>
	)
}
