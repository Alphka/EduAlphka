"use client"

import { ActionIcon, Button, Checkbox, Text, TextInput } from "@mantine/core"
import { signInAction, type UserSignInData } from "../actions/signIn"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { GenericFormValidation } from "@constants/forms"
import { useState } from "react"
import { useForm } from "react-hook-form"
import useServerActionHandler from "@hooks/useServerActionHandler"

interface RegisterFormProps {
	redirectURL: string | undefined
}

export default function RegisterForm({ redirectURL }: RegisterFormProps){
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const [isProfessor, setIsMasterSelected] = useState(true)
	const { handleServerAction, isPending } = useServerActionHandler()

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<Omit<UserSignInData, "account_type">>()

	const PasswordEyeIcon = isPasswordVisible ? MdVisibilityOff : MdVisibility

	return (
		<form
			className="w-4/5 max-w-screen-sm flex flex-col gap-3xl"
			onSubmit={handleSubmit(async ({ name, email, username, password, keep_logged_in }) => {
				handleServerAction(signInAction({
					name,
					email,
					username,
					password,
					account_type: isProfessor ? "professor" : "candidate",
					keep_logged_in
				}, redirectURL))
			})}
		>
			<header className="flex flex-col gap-xs">
				<h1 className="text-6xl font-extrabold">
					Crie uma conta
				</h1>
				<h2 className="text-gray-500 text-4xl font-medium tracking-tight">
					Junte-se à nossa plataforma de testes online e comece sua jornada de aprendizado!
				</h2>
			</header>

			<div className="flex flex-col gap-2xl">
				<div className="flex flex-col gap-md">
					<TextInput
						size="md"
						type="text"
						label="Nome"
						placeholder="Digite o seu nome"
						autoComplete="name"
						{...register("name", {
							minLength: {
								value: GenericFormValidation.nameMinLength,
								message: `O nome deve ter no mínimo ${GenericFormValidation.nameMinLength} caracteres`
							},
							maxLength: {
								value: GenericFormValidation.nameMaxLength,
								message: `O nome deve ter no máximo ${GenericFormValidation.nameMaxLength} caracteres`
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validNamePattern),
								message: "O nome contém caracteres inválidos"
							},
							required: "O nome é obrigatório"
						})}
						error={errors.name?.message}
						withAsterisk
					/>

					<TextInput
						size="md"
						type="text"
						label="Nome de usuário"
						placeholder="Digite o seu usuário"
						autoComplete="username"
						{...register("username", {
							minLength: {
								value: GenericFormValidation.usernameMinLength,
								message: `O nome de usuário deve ter no mínimo ${GenericFormValidation.usernameMinLength} caracteres`
							},
							maxLength: {
								value: GenericFormValidation.usernameMaxLength,
								message: `O nome de usuário deve ter no máximo ${GenericFormValidation.usernameMaxLength} caracteres`
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validUsernamePattern),
								message: "O nome de usuário contém caracteres inválidos"
							},
							required: "O nome de usuário é obrigatório"
						})}
						error={errors.username?.message}
						withAsterisk
					/>

					<TextInput
						size="md"
						type="text"
						label="Email"
						placeholder="Digite o seu endereço de email"
						autoComplete="email"
						{...register("email", {
							minLength: {
								value: GenericFormValidation.emailMinLength,
								message: `O email deve ter no mínimo ${GenericFormValidation.emailMinLength} caracteres`
							},
							maxLength: {
								value: GenericFormValidation.emailMaxLength,
								message: `O email deve ter no máximo ${GenericFormValidation.emailMaxLength} caracteres`
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validEmailPattern),
								message: "E-mail inválido"
							},
							required: "O email é obrigatório"
						})}
						error={errors.email?.message}
						withAsterisk
					/>

					<TextInput
						size="md"
						type={isPasswordVisible ? "text" : "password"}
						label="Senha"
						placeholder={isPasswordVisible ? "exemplo" : "•".repeat(9)}
						autoComplete="current-password"
						pattern={GenericFormValidation.validPasswordPattern}
						rightSection={(
							<ActionIcon
								size="md"
								variant="subtle"
								className="text-current"
								onClick={() => setIsPasswordVisible(!isPasswordVisible)}
								aria-label={isPasswordVisible ? "Esconder senha" : "Mostrar senha"}
								onPointerDown={event => event.detail === 1 || event.preventDefault()}
							>
								<PasswordEyeIcon className="text-[1.25rem]" />
							</ActionIcon>
						)}
						{...register("password", {
							minLength: {
								value: GenericFormValidation.passwordMinLength,
								message: `A senha deve ter no mínimo ${GenericFormValidation.passwordMinLength} caracteres`
							},
							maxLength: {
								value: GenericFormValidation.passwordMaxLength,
								message: `A senha deve ter no máximo ${GenericFormValidation.passwordMaxLength} caracteres`
							},
							pattern: {
								value: new RegExp(GenericFormValidation.validPasswordPattern),
								message: "A senha contém caracteres inválidos"
							},
							required: "A senha é obrigatória"
						})}
						error={errors.password?.message}
						withAsterisk
					/>
				</div>

				<div className="flex flex-col gap-xs">
					<Text size="md">
						Tipo de conta
					</Text>

					<Button.Group>
						<Button
							variant={isProfessor ? "filled" : "default"}
							onClick={() => setIsMasterSelected(true)}
							fullWidth
						>
							Aplicador de testes
						</Button>
						<Button
							variant={isProfessor ? "default" : "filled"}
							onClick={() => setIsMasterSelected(false)}
							fullWidth
						>
							Candidato
						</Button>
					</Button.Group>
				</div>

				<Checkbox
					size="sm"
					label="Manter logado"
					{...register("keep_logged_in")}
					error={errors.keep_logged_in?.message}
					defaultChecked
				/>

				<Button
					type="submit"
					variant="filled"
					loading={isPending}
					aria-label="Criar conta"
				>
					Continuar
				</Button>
			</div>
		</form>
	)
}
