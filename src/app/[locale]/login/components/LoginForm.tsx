"use client"

import type { Dictionary } from "@app/[locale]/dictionaries"
import { ActionIcon, Anchor, Button, Checkbox, TextInput } from "@mantine/core"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { login, type UserLoginData } from "../actions/login"
import { GenericFormValidation } from "@app/constants/forms"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import handleServerAction from "@helpers/handleServerAction"
import Link from "next/link"

interface LoginForm {
	dictionary: Dictionary["login"]
}

export default function LoginForm({ dictionary }: LoginForm){
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const params = useParams()

	const { register, handleSubmit, formState: { errors } } = useForm<UserLoginData>()

	const PasswordEyeIcon = isPasswordVisible ? MdVisibilityOff : MdVisibility

	return (
		<form
			className="w-10/12 max-w-screen-sm flex flex-col gap-12"
			onSubmit={handleSubmit(async ({ username, password, keep_logged_in }) => {
				handleServerAction({
					promise: login(username, password, keep_logged_in),
					setLoading
				})
			})}
		>
			<header className="flex flex-col gap-2">
				<h1 className="text-4xl font-extrabold leading-none">
					{dictionary.form.title}
				</h1>
				<h2 className="text-neutral-700 dark:text-gray-400 text-xl font-normal leading-tight tracking-tight">
					{dictionary.form.subtitle}
				</h2>
			</header>

			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-4">
					<TextInput
						size="md"
						type="text"
						label={dictionary.form.username.label}
						placeholder={dictionary.form.username.placeholder}
						autoComplete="username"
						withAsterisk={false}
						{...register("username", {
							minLength: {
								value: GenericFormValidation.usernameMinLength,
								message: dictionary.form.username.validations.min
							},
							maxLength: {
								value: GenericFormValidation.usernameMaxLength,
								message: dictionary.form.username.validations.max
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validUsernamePattern),
								message: dictionary.form.username.validations.invalidPattern
							},
							required: true
						})}
						error={errors.username?.message}
					/>

					<TextInput
						size="md"
						type={isPasswordVisible ? "text" : "password"}
						label={dictionary.form.password.label}
						placeholder={isPasswordVisible ? dictionary.form.password.placeholder : "•".repeat(dictionary.form.password.placeholder.length)}
						autoComplete="current-password"
						pattern={GenericFormValidation.validPasswordPattern}
						rightSection={(
							<ActionIcon
								size="md"
								variant="subtle"
								className="text-current"
								onClick={() => setIsPasswordVisible(!isPasswordVisible)}
								aria-label={dictionary.form.password.eye[isPasswordVisible ? "hide" : "show"]}
								onPointerDown={event => event.detail === 1 || event.preventDefault()}
							>
								<PasswordEyeIcon className="text-xl" />
							</ActionIcon>
						)}
						withAsterisk={false}
						{...register("password", {
							minLength: {
								value: GenericFormValidation.passwordMinLength,
								message: dictionary.form.password.validations.min
							},
							maxLength: {
								value: GenericFormValidation.passwordMaxLength,
								message: dictionary.form.password.validations.max
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validPasswordPattern),
								message: dictionary.form.password.validations.invalidPattern
							},
							required: true
						})}
						error={errors.password?.message}
					/>
				</div>

				<div className="flex items-center justify-between">
					<Checkbox
						size="sm"
						label={dictionary.form.keepLoggedIn.label}
						{...register("keep_logged_in")}
						error={errors.keep_logged_in?.message}
						defaultChecked
					/>

					<Anchor
						href={`/${params.locale}/recover-password`}
						className="px-0.5 rounded-sm"
						component={Link}
					>
						{dictionary.form.forgotYourPassword.text}
					</Anchor>
				</div>

				<Button
					type="submit"
					variant="filled"
					loading={loading}
					aria-label={dictionary.form.send.accessibilityText}
				>
					{dictionary.form.send.text}
				</Button>
			</div>

			<Anchor
				href={`/${params.locale}/register`}
				className="self-center text-current text-center px-2 rounded-sm"
				aria-label={dictionary.form.register.accessibilityText}
				component={Link}
				prefetch
			>
				{dictionary.form.register.text}
			</Anchor>
		</form>
	)
}
