"use client"

import type { Dictionary } from "@dictionaries"
import { ExamFormValidation } from "@constants/forms"
import { TextInput } from "@mantine/core"
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
					{dictionary.exam.form.examData.title}
				</Legend>

				<div className="flex flex-col gap-6">
					<TextInput
						size="md"
						type="text"
						label={dictionary.inputs.examTitle.label}
						placeholder={dictionary.inputs.examTitle.placeholder}
						autoComplete="off"
						withAsterisk={false}
						{...register("title", {
							minLength: {
								value: ExamFormValidation.titleMinLength,
								message: dictionary.inputs.examTitle.validations.min
							},
							maxLength: {
								value: ExamFormValidation.titleMaxLength,
								message: dictionary.inputs.examTitle.validations.max
							},
							required: true
						})}
						error={errors.title?.message}
					/>

					<TextInput
						size="md"
						type="text"
						label={dictionary.inputs.examDescription.label}
						placeholder={dictionary.inputs.examDescription.placeholder}
						autoComplete="off"
						withAsterisk={false}
						{...register("description", {
							minLength: {
								value: ExamFormValidation.descriptionMinLength,
								message: dictionary.inputs.examDescription.validations.min
							},
							maxLength: {
								value: ExamFormValidation.descriptionMaxLength,
								message: dictionary.inputs.examDescription.validations.max
							}
						})}
						error={errors.description?.message}
					/>

					<TextInput
						size="md"
						type="text"
						inputMode="numeric"
						label={dictionary.inputs.examDuration.label}
						placeholder={dictionary.inputs.examDuration.placeholder}
						autoComplete="off"
						withAsterisk={false}
						{...register("duration", {
							min: {
								value: ExamFormValidation.minDurationInMinutes,
								message: dictionary.inputs.examDuration.validations.min
							},
							max: {
								value: ExamFormValidation.maxDurationInMinutes,
								message: dictionary.inputs.examDuration.validations.max
							},
							required: true
						})}
						error={errors.duration?.message}
					/>
				</div>
			</fieldset>
		</form>
	)
}
