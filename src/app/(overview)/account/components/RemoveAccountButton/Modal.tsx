import type { RemoveAccountButtonProps } from "."
import { MdInfoOutline, MdVisibility, MdVisibilityOff, MdWarningAmber } from "react-icons/md"
import { ActionIcon, Badge, Button, Modal, TextInput } from "@mantine/core"
import { memo, useCallback, useState } from "react"
import { GenericFormValidation } from "@constants/forms"
import { useForm } from "react-hook-form"
import { twJoin } from "tailwind-merge"
import useServerActionHandler from "@hooks/useServerActionHandler"
import checkPassword from "../../actions/checkPassword"
import deleteUser from "../../actions/deleteUser"

interface RemoveAccountModalProps extends Pick<RemoveAccountButtonProps, "user"> {
	opened: boolean
	onClose: () => void
}

const RemoveAccountModal = memo(function RemoveAccountModal({ user, opened, onClose }: RemoveAccountModalProps){
	const { handleServerAction: handleCheckPasswordServerAction, isPending: isCheckPasswordPending } = useServerActionHandler({
		successOptions: {
			action(){
				setIsPasswordCorrect(true)
			}
		}
	})
	const { handleServerAction: handleDeleteUserServerAction, isPending: isDeleteUserPending } = useServerActionHandler()

	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const [isPasswordCorrect, setIsPasswordCorrect] = useState(false)

	const {
		reset,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<{ password: string }>({
		shouldFocusError: true,
		shouldUnregister: true,
		reValidateMode: "onChange",
		mode: "onSubmit"
	})

	const handleClose = useCallback(() => {
		reset()
		onClose()
		setIsPasswordVisible(false)
	}, [reset, onClose])

	const PasswordEyeIcon = isPasswordVisible ? MdVisibilityOff : MdVisibility

	return (
		<Modal
			size="auto"
			opened={opened}
			onClose={handleClose}
			transitionProps={{ transition: "fade", duration: 200 }}
			withCloseButton={false}
			closeOnClickOutside
			closeOnEscape
			trapFocus
			centered
			classNames={{
				body: twJoin(
					"flex flex-col justify-center px-3xl py-xl",
					isPasswordCorrect ? "gap-4xl" : "gap-2xl"
				)
			}}
		>
			<header className="flex flex-col gap-md">
				<div className="flex items-center gap-md">
					<Badge
						className="flex-shrink-0"
						size="xl"
						color={isPasswordCorrect ? "red" : "blue"}
						circle
						variant="light"
					>
						{isPasswordCorrect ? <MdWarningAmber /> : <MdInfoOutline />}
					</Badge>

					<h1 className="text-h4 font-medium">
						{isPasswordCorrect ? "Deseja realmente excluir a sua conta?" : "Confirme a sua identidade"}
					</h1>
				</div>

				<h2 className="text-dark-200 text-h6 font-normal">
					{isPasswordCorrect ? <>
						Você está excluindo a sua conta na plataforma.<br />
						{user.accountType === "professor"
							? "Todos os testes criados por você serão excluídos."
							: "As respostas publicadas por você serão mantidas na plataforma."
						}<br />
						Deseja continuar?
					</> : "Insira a senha atual da sua conta para alterar suas informações pessoais."}
				</h2>
			</header>

			{isPasswordCorrect ? (
				<div className="self-stretch flex flex-col xs:flex-row items-end xs:items-center xs:justify-end gap-lg">
					<Button
						className="flex-shrink-0 w-full xs:w-auto"
						size="sm"
						color="gray"
						variant="light"
						onClick={handleClose}
						aria-label="Cancelar exclusão da conta"
					>
						Cancelar
					</Button>

					<Button
						className="flex-shrink-0 w-full xs:w-auto"
						size="sm"
						color="red"
						variant="filled"
						onClick={async () => {
							await handleDeleteUserServerAction(deleteUser())
							handleClose()
						}}
						aria-label="Excluir conta"
						loading={isDeleteUserPending}
					>
						Excluir
					</Button>
				</div>
			) : (
				<form
					className="flex-grow flex flex-col gap-xl"
					onSubmit={handleSubmit(async ({ password }) => {
						await handleCheckPasswordServerAction(checkPassword(password))
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
							onClick={handleClose}
							aria-label="Cancelar exclusão da conta"
						>
							Cancelar
						</Button>

						<Button
							className="flex-shrink-0 w-full xs:w-auto"
							type="submit"
							size="sm"
							color="blue"
							variant="filled"
							aria-label="Confirmar senha atual"
							loading={isCheckPasswordPending}
						>
							Continuar
						</Button>
					</div>
				</form>
			)}
		</Modal>
	)
})

export default RemoveAccountModal
