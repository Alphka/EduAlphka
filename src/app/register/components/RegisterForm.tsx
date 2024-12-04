"use client"

import { ActionIcon, Button, Checkbox, Stack, Text, TextInput, Title } from "@mantine/core"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { signIn, type UserSignInData } from "../actions/signIn"
import { GenericFormValidation } from "@constants/forms"
import { useState } from "react"
import { useForm } from "react-hook-form"
import useServerActionHandler from "@hooks/useServerActionHandler"

export default function RegisterForm(){
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
		<Stack
			w="80%"
			className="max-w-screen-sm"
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
			gap="3xl"
		>
			<Stack
				component="header"
				gap="xs"
			>
				<Title
					order={1}
					fz="6xl"
					fw={800}
				>
					Crie uma conta
				</Title>

				<Title
					order={2}
					lts="-0.025em"
					fz="4xl"
					fw={500}
					c="gray"
				>
					Junte-se à nossa plataforma de testes online e comece sua jornada de aprendizado!
				</Title>
			</Stack>

			<Stack gap="2xl">
				<Stack gap="md">
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
							required: {
								value: true,
								message: "O nome é obrigatório"
							}
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
							required: {
								value: true,
								message: "O nome de usuário é obrigatório"
							}
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
								message: "O email contém caracteres inválidos"
							},
							required: {
								value: true,
								message: "O email é obrigatório"
							}
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
							required: {
								value: true,
								message: "A senha é obrigatória"
							}
						})}
						error={errors.password?.message}
						withAsterisk
					/>
				</Stack>

				<Stack gap="xs">
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
				</Stack>

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
			</Stack>
		</Stack>
	)
}
