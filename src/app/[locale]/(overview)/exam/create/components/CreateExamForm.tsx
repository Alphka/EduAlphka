"use client"

import type { Dictionary } from "@dictionaries"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { NumberInput, Textarea, TextInput } from "@mantine/core"
import { useForm } from "react-hook-form"
import Legend from "@app/components/forms/Legend"

interface CreateExamFormProps {
	dictionary: Dictionary
}

export default function CreateExamForm({ dictionary }: CreateExamFormProps){
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<{
		title: string
		description?: string
		duration: number
	}>()

	return (
		<form
			className="flex flex-col gap-10"
			onSubmit={handleSubmit(() => {})}
		>
			<fieldset>
				<Legend>
					{dictionary.exam.createForm.form.examData.title}
				</Legend>

				<div className="flex flex-col gap-6">
					<TextInput
						size="md"
						type="text"
						label={dictionary.inputs.examTitle.label}
						placeholder={dictionary.inputs.examTitle.placeholder}
						aria-label={dictionary.inputs.examTitle.placeholder}
						autoComplete="off"
						{...register("title", {
							minLength: {
								value: ExamFormValidation.titleMinLength,
								message: dictionary.inputs.examTitle.validations.min
							},
							maxLength: {
								value: ExamFormValidation.titleMaxLength,
								message: dictionary.inputs.examTitle.validations.max
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validSpecialNamePattern),
								message: dictionary.inputs.password.validations.invalidPattern
							},
							required: true
						})}
						error={errors.title?.message}
					/>

					<Textarea
						size="md"
						minRows={2}
						maxRows={12}
						label={dictionary.inputs.examDescription.label}
						placeholder={dictionary.inputs.examDescription.placeholder}
						aria-label={dictionary.inputs.examDescription.placeholder}
						autoComplete="off"
						{...register("description", {
							minLength: {
								value: ExamFormValidation.descriptionMinLength,
								message: dictionary.inputs.examDescription.validations.min
							},
							maxLength: {
								value: ExamFormValidation.descriptionMaxLength,
								message: dictionary.inputs.examDescription.validations.max
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validDescriptionPattern),
								message: dictionary.inputs.password.validations.invalidPattern
							},
						})}
						error={errors.description?.message}
						autosize
					/>

					<NumberInput
						size="md"
						label={dictionary.inputs.examDuration.label}
						placeholder={dictionary.inputs.examDuration.placeholder}
						aria-label={dictionary.inputs.examDuration.placeholder}
						autoComplete="off"
						step={1}
						decimalScale={0}
						allowNegative={false}
						stepHoldDelay={300}
        				stepHoldInterval={stepCount => Math.max(1000 / stepCount ** 2, 25)}
						{...register("duration", {
							min: {
								value: ExamFormValidation.minDurationInMinutes,
								message: dictionary.inputs.examDuration.validations.min
							},
							max: {
								value: ExamFormValidation.maxDurationInMinutes,
								message: dictionary.inputs.examDuration.validations.max
							},
							pattern: {
								value: /^\d+$/,
								message: dictionary.inputs.password.validations.invalidPattern
							},
							required: true
						})}
						onBlur={undefined}
						onChange={undefined}
						min={ExamFormValidation.minDurationInMinutes}
						max={ExamFormValidation.maxDurationInMinutes}
						error={errors.duration?.message}
					/>
				</div>
			</fieldset>
		</form>
	)
}
