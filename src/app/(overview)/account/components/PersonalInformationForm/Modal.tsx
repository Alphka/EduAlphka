import { MdInfoOutline, MdVisibility, MdVisibilityOff } from "react-icons/md"
import { ActionIcon, Badge, Button, Modal, TextInput } from "@mantine/core"
import { GenericFormValidation } from "@constants/forms"
import { useState } from "react"
import { useForm } from "react-hook-form"
import editPersonalInformation, { type PersonalInformationData } from "../../actions/editPersonalInformation"
import useServerActionHandler from "@hooks/useServerActionHandler"

interface PersonalInformationModalProps {
	data?: PersonalInformationData
	onSave: () => void
	onClose: () => void
}

export default function PersonalInformationModal({ data, onSave, onClose }: PersonalInformationModalProps){
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	const { handleServerAction, isPending } = useServerActionHandler({
		successOptions: {
			message: "Informações pessoais atualizadas com sucesso!",
			action: onSave
		}
	})

	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors }
	} = useForm<{ password: string }>({
		shouldFocusError: true,
		shouldUnregister: true,
		reValidateMode: "onChange",
		mode: "onSubmit"
	})

	const PasswordEyeIcon = isPasswordVisible ? MdVisibilityOff : MdVisibility

	return (
		<Modal
			size="md"
			opened={!!data}
			onClose={onClose}
			transitionProps={{ transition: "fade", duration: 200 }}
			withCloseButton={false}
			closeOnClickOutside
			closeOnEscape
			trapFocus
			centered
			classNames={{
				body: "flex flex-col px-3xl py-xl gap-2xl"
			}}
		>
			<header className="flex flex-col gap-md">
				<div className="flex items-center gap-md">
					<Badge
						className="flex-shrink-0"
						size="xl"
						color="blue"
						circle
						variant="light"
					>
						<MdInfoOutline />
					</Badge>

					<h1 className="text-h4 font-medium">
						Confirme a sua identidade
					</h1>

				</div>

				<h2 className="text-dark-200 text-h6 font-normal">
					Insira a senha atual da sua conta para alterar suas informações pessoais.
				</h2>
			</header>

			<form
				className="flex-grow flex flex-col gap-xl"
				onSubmit={handleSubmit(async ({ password }) => {
					await handleServerAction(editPersonalInformation(password, data!))
				})}
			>
				<TextInput
					size="md"
					type={isPasswordVisible ? "text" : "password"}
					label="Senha"
					placeholder="Digite a sua senha"
					autoComplete="current-password"
					rightSection={(
						<ActionIcon
							size="md"
							variant="subtle"
							className="text-current"
							aria-label={isPasswordVisible ? "Esconder senha" : "Mostrar senha"}
							onPointerDown={event => event.detail === 1 || event.preventDefault()}
							onClick={() => setIsPasswordVisible(!isPasswordVisible)}
							hidden={getValues("password") === undefined}
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
					defaultValue=""
					enterKeyHint="send"
					error={errors.password?.message}
				/>

				<div className="flex flex-col xs:flex-row items-end xs:items-center xs:justify-end gap-lg">
					<Button
						className="flex-shrink-0 w-full xs:w-auto"
						size="sm"
						color="gray"
						variant="light"
						onClick={onClose}
						aria-label="Cancelar exclusão"
					>
						Cancelar
					</Button>

					<Button
						className="flex-shrink-0 w-full xs:w-auto"
						type="submit"
						size="sm"
						color="blue"
						variant="filled"
						aria-label="Salvar informações"
						loading={isPending}
					>
						Salvar
					</Button>
				</div>
			</form>
		</Modal>
	)
}
