"use client"

import type { PersonalInformationData } from "../actions/editPersonalInformation"
import type verifyAuthorization from "@helpers/verifyAuthorization"
import { MdEdit, MdVisibility, MdVisibilityOff } from "react-icons/md"
import { ActionIcon, Button, Paper, TextInput } from "@mantine/core"
import { GenericFormValidation } from "@constants/forms"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import editPersonalInformation from "../actions/editPersonalInformation"
import useServerActionHandler from "@hooks/useServerActionHandler"

interface PersonalInformationFormProps {
	user: Pick<Awaited<ReturnType<typeof verifyAuthorization>>, "name" | "username" | "email">
}

export default function PersonalInformationForm({ user }: PersonalInformationFormProps){
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const [enabled, setEnabled] = useState(false)
	const router = useRouter()

	const { handleServerAction, isPending } = useServerActionHandler({
		successOptions: {
			message: "Informações pessoais atualizadas com sucesso!",
			action: () => router.refresh()
		}
	})

	const {
		register,
		setFocus,
		getValues,
		handleSubmit,
		formState: { errors, isDirty }
	} = useForm<PersonalInformationData>({
		reValidateMode: "onChange",
		defaultValues: {
			username: user.username,
			email: user.email,
			name: user.name
		},
		mode: "onChange"
	})

	useEffect(() => {
		if(!isDirty && !isPending) return

		const handler = (event: BeforeUnloadEvent) => {
			event.preventDefault()
			return event.returnValue = "As alterações no formulário de informações pessoais precisam ser salvas"
		}

		window.addEventListener("beforeunload", handler)

		return () => window.removeEventListener("beforeunload", handler)
	}, [isDirty, isPending])

	const PasswordEyeIcon = isPasswordVisible ? MdVisibilityOff : MdVisibility

	return (
		<Paper
			className="flex flex-col p-lg rounded shadow-xs gap-md"
			component="form"
			onSubmit={handleSubmit(({ password, ...data }) => {
				handleServerAction(editPersonalInformation({
					password: password?.trim() || undefined,
					...data
				}))
			})}
			withBorder
		>
			<header className="flex justify-between">
				<h2 className="text-h5">
					Informações pessoais
				</h2>

				<Button
					size="compact-sm"
					variant="light"
					leftSection={<MdEdit className="text-base" />}
					aria-label="Editar informações pessoais"
					onClick={event => {
						event.preventDefault()
						setEnabled(enabled => !enabled)
						setTimeout(() => setFocus("name"))
					}}
				>
					Editar
				</Button>
			</header>

			<ul className="flex flex-col gap-sm">
				<li>
					<TextInput
						type="text"
						label="Nome completo"
						variant={enabled ? "default" : "filled"}
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
							required: "O e-mail é obrigatório"
						})}
						defaultValue={user.name}
						readOnly={!enabled}
						inert={!enabled}
						error={enabled ? errors.name?.message : undefined}
					/>
				</li>
				<li>
					<TextInput
						type="text"
						label="Nome de usuário"
						variant={enabled ? "default" : "filled"}
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
						defaultValue={user.username}
						readOnly={!enabled}
						inert={!enabled}
						error={enabled ? errors.username?.message : undefined}
					/>
				</li>
				<li>
					<TextInput
						type="email"
						label="Email"
						variant={enabled ? "default" : "filled"}
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
							required: "O e-mail é obrigatório"
						})}
						defaultValue={user.email}
						readOnly={!enabled}
						inert={!enabled}
						error={enabled ? errors.email?.message : undefined}
					/>
				</li>
				<li>
					<TextInput
						size="md"
						type={enabled && isPasswordVisible ? "text" : "password"}
						label="Senha"
						variant={enabled ? "default" : "filled"}
						placeholder="Digite uma nova senha"
						autoComplete="new-password"
						rightSection={(
							<ActionIcon
								size="md"
								variant="subtle"
								className="text-current"
								aria-label={isPasswordVisible ? "Esconder senha" : "Mostrar senha"}
								onPointerDown={event => event.detail === 1 || event.preventDefault()}
								onClick={() => setIsPasswordVisible(!isPasswordVisible)}
								hidden={!enabled || getValues("password") === undefined}
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
							}
						})}
						readOnly={!enabled}
						inert={!enabled}
						error={enabled ? errors.password?.message : undefined}
					/>
				</li>
			</ul>

			{enabled && (
				<Button
					type="submit"
					className="self-start"
					aria-label="Enviar formulário"
					loading={isPending}
				>
					Salvar
				</Button>
			)}
		</Paper>
	)
}
