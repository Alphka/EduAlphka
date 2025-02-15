"use client"

import type { PersonalInformationData } from "../../actions/editPersonalInformation"
import type verifyAuthorization from "@helpers/verifyAuthorization"
import { MdEdit, MdVisibility, MdVisibilityOff } from "react-icons/md"
import { ActionIcon, Button, Paper, TextInput } from "@mantine/core"
import { GenericFormValidation } from "@constants/forms"
import { useMemo, useState } from "react"
import { isEqual, pick } from "lodash"
import { useForm } from "react-hook-form"
import { twJoin } from "tailwind-merge"
import { toast } from "react-toastify"
import PersonalInformationModal from "./Modal"


interface PersonalInformationFormProps {
	user: Pick<Awaited<ReturnType<typeof verifyAuthorization>>, "name" | "username" | "email">
}

export default function PersonalInformationForm({ user }: PersonalInformationFormProps){
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const [modalData, setModalData] = useState<PersonalInformationData | undefined>(undefined)
	const [enabled, setEnabled] = useState(false)

	const defaultValues = useMemo(() => pick(user, ["name", "email", "username"] as const), [user.name, user.email, user.username])

	const {
		register,
		setFocus,
		getValues,
		handleSubmit,
		formState: { errors }
	} = useForm<PersonalInformationData>({
		reValidateMode: "onChange",
		defaultValues,
		mode: "onChange"
	})

	const PasswordEyeIcon = isPasswordVisible ? MdVisibilityOff : MdVisibility

	return (
		<Paper
			className="flex flex-col p-lg rounded shadow-xs gap-md"
			component="form"
			onSubmit={handleSubmit(data => {
				if(!(data.password = data.password?.trim())) delete data.password

				if(isEqual(data, defaultValues)){
					toast.error("Nenhuma informação foi alterada")
					return
				}

				setModalData(data)
			})}
			withBorder
		>
			<header className="flex justify-between">
				<h2 className="text-h5">
					Informações pessoais
				</h2>

				<Button
					size="compact-sm"
					type="button"
					variant="light"
					leftSection={<MdEdit className="max-xs:hidden text-base" />}
					aria-label={`${enabled ? "Desabilitar" : "Habilitar"} formulário para editar informações pessoais`}
					onClick={() => {
						setEnabled(!enabled)
						setTimeout(() => setFocus("name"))
					}}
				>
					Editar
				</Button>
			</header>

			<fieldset className="flex flex-col gap-sm">
				<TextInput
					size="md"
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

				<TextInput
					size="md"
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

				<TextInput
					size="md"
					type="email"
					label="Email"
					variant={enabled ? "default" : "filled"}
					placeholder="Digite o seu endereço de email"
					autoComplete="email"
					classNames={{
						input: twJoin(!enabled && "[-webkit-text-security:disc]")
					}}
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
			</fieldset>

			{enabled && (
				<Button
					size="md"
					type="submit"
					className="self-start"
					aria-label="Enviar formulário"
				>
					Salvar
				</Button>
			)}

			<PersonalInformationModal
				data={modalData}
				onClose={() => setModalData(undefined)}
				onSave={() => {
					setModalData(undefined)
					setEnabled(false)
				}}
			/>
		</Paper>
	)
}
