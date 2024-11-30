"use client"

import type { Dictionary } from "@dictionaries"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { ActionIcon, Textarea, TextInput } from "@mantine/core"
import { MdAccessTime } from "react-icons/md"
import { TimeInput } from "@mantine/dates"
import { useForm } from "react-hook-form"
import { useRef } from "react"
import Legend from "@app/components/forms/Legend"

interface CreateExamFormProps {
	dictionary: Dictionary
}

export default function CreateExamForm({ dictionary }: CreateExamFormProps){
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
						withAsterisk
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
								message: dictionary.inputs.examDescription.validations.invalidPattern
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
							label={dictionary.inputs.examSubject.label}
							placeholder={dictionary.inputs.examSubject.placeholder}
							aria-label={dictionary.inputs.examSubject.placeholder}
							autoComplete="off"
							{...register("subject", {
								minLength: {
									value: GenericFormValidation.nameMinLength,
									message: dictionary.inputs.examSubject.validations.min
								},
								maxLength: {
									value: GenericFormValidation.nameMaxLength,
									message: dictionary.inputs.examSubject.validations.max
								},
								pattern: {
									value: new RegExp(GenericFormValidation.validSpecialNamePattern),
									message: dictionary.inputs.examSubject.validations.invalidPattern
								}
							})}
							error={errors.title?.message}
						/>

						<TimeInput
							size="md"
							className="basis-1/5"
							label={dictionary.inputs.examDuration.label}
							placeholder={dictionary.inputs.examDuration.placeholder}
							aria-label={dictionary.inputs.examDuration.placeholder}
							step={1}
							rightSection={(
								<ActionIcon
									color="gray"
									variant="subtle"
									onClick={() => durationInputRef.current?.showPicker()}
								>
									<MdAccessTime className="text-base" />
								</ActionIcon>
							)}
							minTime={formatDurationTime(ExamFormValidation.minDurationInMinutes)}
							maxTime={formatDurationTime(ExamFormValidation.maxDurationInMinutes)}
							{...register("duration", { required: true })}
							min={ExamFormValidation.minDurationInMinutes}
							max={ExamFormValidation.maxDurationInMinutes}
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

function formatDurationTime(minutes: number){
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = Math.floor(minutes % 60)
    const seconds = Math.round((minutes % 1) * 60)

    const formattedHours = hours.toString().padStart(2, "0")
    const formattedMinutes = remainingMinutes.toString().padStart(2, "0")
    const formattedSeconds = seconds.toString().padStart(2, "0")

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}
