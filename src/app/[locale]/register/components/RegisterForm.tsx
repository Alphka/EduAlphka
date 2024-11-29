"use client"

import type { Dictionary } from "@dictionaries"
import { ActionIcon, Button, Checkbox, Text, TextInput } from "@mantine/core"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { signIn, type UserSignInData } from "../actions/signIn"
import { GenericFormValidation } from "@constants/forms"
import { useState } from "react"
import { useForm } from "react-hook-form"
import useServerActionHandler from "@hooks/useServerActionHandler"

interface RegisterFormProps {
	dictionary: Dictionary
}

export default function RegisterForm({ dictionary }: RegisterFormProps){
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const [isProfessor, setIsMasterSelected] = useState(true)
	const { isPending, handleServerAction } = useServerActionHandler()

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<Omit<UserSignInData, "account_type">>()

	const PasswordEyeIcon = isPasswordVisible ? MdVisibilityOff : MdVisibility

	return (
		<form
			className="w-10/12 max-w-screen-sm flex flex-col gap-12"
			onSubmit={handleSubmit(async ({ name, email, username, password, keep_logged_in }) => {
				handleServerAction(signIn({
					name,
					email,
					username,
					password,
					account_type: isProfessor ? "professor" : "candidate",
					keep_logged_in
				}))
			})}
		>
			<header className="flex flex-col gap-2">
				<h1 className="text-4xl font-extrabold">
					{dictionary.register.form.title}
				</h1>
				<h2 className="text-neutral-700 dark:text-gray-400 text-xl font-normal leading-tight tracking-tight">
					{dictionary.register.form.subtitle}
				</h2>
			</header>

			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-4">
					<TextInput
						size="md"
						type="text"
						label={dictionary.inputs.name.label}
						placeholder={dictionary.inputs.name.placeholder}
						autoComplete="name"
						withAsterisk={false}
						{...register("name", {
							minLength: {
								value: GenericFormValidation.nameMinLength,
								message: dictionary.inputs.name.validations.min
							},
							maxLength: {
								value: GenericFormValidation.nameMaxLength,
								message: dictionary.inputs.name.validations.max
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validNamePattern),
								message: dictionary.inputs.name.validations.invalidPattern
							},
							required: true
						})}
						error={errors.name?.message}
					/>

					<TextInput
						size="md"
						type="text"
						label={dictionary.inputs.username.label}
						placeholder={dictionary.inputs.username.placeholder}
						autoComplete="username"
						withAsterisk={false}
						{...register("username", {
							minLength: {
								value: GenericFormValidation.usernameMinLength,
								message: dictionary.inputs.username.validations.min
							},
							maxLength: {
								value: GenericFormValidation.usernameMaxLength,
								message: dictionary.inputs.username.validations.max
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validUsernamePattern),
								message: dictionary.inputs.username.validations.invalidPattern
							},
							required: true
						})}
						error={errors.username?.message}
					/>

					<TextInput
						size="md"
						type="text"
						label={dictionary.inputs.email.label}
						placeholder={dictionary.inputs.email.placeholder}
						autoComplete="email"
						withAsterisk={false}
						{...register("email", {
							minLength: {
								value: GenericFormValidation.emailMinLength,
								message: dictionary.inputs.email.validations.min
							},
							maxLength: {
								value: GenericFormValidation.emailMaxLength,
								message: dictionary.inputs.email.validations.max
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validEmailPattern),
								message: dictionary.inputs.email.validations.invalid
							},
							required: true
						})}
						error={errors.email?.message}
					/>

					<TextInput
						size="md"
						type={isPasswordVisible ? "text" : "password"}
						label={dictionary.inputs.password.label}
						placeholder={isPasswordVisible ? dictionary.inputs.password.placeholder : "•".repeat(dictionary.inputs.password.placeholder.length)}
						autoComplete="current-password"
						pattern={GenericFormValidation.validPasswordPattern}
						rightSection={(
							<ActionIcon
								size="md"
								variant="subtle"
								className="text-current"
								onClick={() => setIsPasswordVisible(!isPasswordVisible)}
								aria-label={dictionary.inputs.password.eye[isPasswordVisible ? "hide" : "show"]}
								onPointerDown={event => event.detail === 1 || event.preventDefault()}
							>
								<PasswordEyeIcon className="text-xl" />
							</ActionIcon>
						)}
						withAsterisk={false}
						{...register("password", {
							minLength: {
								value: GenericFormValidation.passwordMinLength,
								message: dictionary.inputs.password.validations.min
							},
							maxLength: {
								value: GenericFormValidation.passwordMaxLength,
								message: dictionary.inputs.password.validations.max
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validPasswordPattern),
								message: dictionary.inputs.password.validations.invalidPattern
							},
							required: true
						})}
						error={errors.password?.message}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<Text size="md">
						{dictionary.inputs.accountType.label}
					</Text>

					<Button.Group>
						<Button
							variant={isProfessor ? "filled" : "default"}
							onClick={() => setIsMasterSelected(true)}
							fullWidth
						>
							{dictionary.inputs.accountType.professor.text}
						</Button>
						<Button
							variant={isProfessor ? "default" : "filled"}
							onClick={() => setIsMasterSelected(false)}
							fullWidth
						>
							{dictionary.inputs.accountType.candidate.text}
						</Button>
					</Button.Group>
				</div>

				<Checkbox
					size="sm"
					label={dictionary.inputs.keepLoggedIn.label}
					{...register("keep_logged_in")}
					error={errors.keep_logged_in?.message}
					defaultChecked
				/>

				<Button
					type="submit"
					variant="filled"
					loading={isPending}
					aria-label={dictionary.register.form.send.accessibilityText}
				>
					{dictionary.register.form.send.text}
				</Button>
			</div>
		</form>
	)
}
