"use client"

import { ActionIcon, Anchor, Button, Checkbox, TextInput } from "@mantine/core"
import { loginAction, type UserLoginData } from "../actions/login"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { GenericFormValidation } from "@constants/forms"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import useServerActionHandler from "@hooks/useServerActionHandler"
import routes from "@app/routes"
import Link from "next/link"

interface LoginFormProps {
	redirectURL: string | undefined
}

export default function LoginForm({ redirectURL }: LoginFormProps){
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const { handleServerAction, isPending } = useServerActionHandler()

	const registerURL = useMemo(() => {
		const searchParams: URLSearchParams = new URLSearchParams()

		if(
			redirectURL &&
			redirectURL !== "/" &&
			redirectURL !== "/login" &&
			/^\/(?!.*\/\/)([\w-\/]+)$/.test(redirectURL)
		){
			searchParams.set("redirect", redirectURL)
		}

		const searchParamsString = searchParams.toString()

		return `${routes.register.pathname}${searchParamsString.toString() as "" | `?${string}`}` as const
	}, [redirectURL])

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<UserLoginData>()

	const PasswordEyeIcon = isPasswordVisible ? MdVisibilityOff : MdVisibility

	return (
		<form
			className="w-4/5 max-w-screen-sm flex flex-col gap-3xl"
			onSubmit={handleSubmit(async ({ username, password, keep_logged_in }) => {
				handleServerAction(loginAction({
					username,
					password,
					keep_logged_in
				}, redirectURL))
			})}
		>
			<header className="flex flex-col gap-xs">
				<h1 className="text-6xl font-extrabold">
					Acesse sua conta
				</h1>
				<h2 className="text-gray-500 text-4xl font-medium tracking-tight">
					Entre com seu endereço de email ou nome usuário.
				</h2>
			</header>

			<div className="flex flex-col gap-2xl">
				<div className="flex flex-col gap-md">
					<TextInput
						size="md"
						type="text"
						label="Email ou nome de usuário"
						placeholder="Digite o seu endereço de email ou nome de usuário"
						autoComplete="username"
						{...register("username", {
							minLength: {
								value: Math.min(GenericFormValidation.emailMinLength, GenericFormValidation.usernameMinLength),
								message: `O email ou nome de usuário deve ter no mínimo ${Math.min(GenericFormValidation.emailMinLength, GenericFormValidation.usernameMinLength)} caracteres`
							},
							maxLength: {
								value: Math.max(GenericFormValidation.emailMaxLength, GenericFormValidation.usernameMaxLength),
								message: `O email ou nome de usuário deve ter no máximo ${Math.max(GenericFormValidation.emailMaxLength, GenericFormValidation.usernameMaxLength)} caracteres`
							},
							required: "O email ou nome de usuário é obrigatório"
						})}
						error={errors.username?.message}
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

				<div className="flex justify-between gap-md">
					<Checkbox
						size="sm"
						label="Manter logado"
						{...register("keep_logged_in")}
						error={errors.keep_logged_in?.message}
						defaultChecked
					/>

					<Anchor
						href={routes.recoverPassword.pathname}
						className="px-0.5 rounded-sm"
						component={Link}
						prefetch={false}
					>
						Esqueceu sua senha?
					</Anchor>
				</div>

				<Button
					type="submit"
					variant="filled"
					loading={isPending}
					aria-label="Entrar na conta"
				>
					Continuar
				</Button>
			</div>

			<Anchor
				href={registerURL}
				className="self-center text-current text-center px-2 rounded-sm"
				aria-label="Criar uma conta"
				component={Link}
				prefetch
			>
				Não tem uma conta? Crie uma agora mesmo!
			</Anchor>
		</form>
	)
}
