"use client"

import recoverPassword, { type PasswordRecoveryData } from "../actions/recoverPassword"
import useServerActionHandler from "@hooks/useServerActionHandler"
import sendVerificationCode from "../actions/sendVerificationCode"
import { GenericFormValidation, PasswordRecoveryFormValidation } from "@constants/forms"
import { Button, PinInput, TextInput } from "@mantine/core"
import { MdChevronLeft } from "react-icons/md"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { pick } from "lodash"

type FormSteps = "email" | "code"

export default function PasswordRecoveryForm(){
	const [step, setStep] = useState<FormSteps>("email")

	const {
		handleServerAction: handleVerificationCodeServerAction,
		isPending: isVerificationCodePending
	} = useServerActionHandler({
		successOptions: {
			action: () => setStep("code")
		}
	})

	const {
		handleServerAction: handleRecoverPasswordServerAction,
		isPending: isRecoverPasswordPending
	} = useServerActionHandler()

	const {
		trigger,
		register,
		setValue,
		setFocus,
		getValues,
		handleSubmit,
		formState: { errors }
	} = useForm<PasswordRecoveryData>({
		reValidateMode: "onChange",
		mode: "onSubmit"
	})

	const code = register("code", {
		minLength: {
			value: PasswordRecoveryFormValidation.codeLength,
			message: `O código de verificação deve ter ${PasswordRecoveryFormValidation.codeLength} dígitos`
		},
		maxLength: {
			value: PasswordRecoveryFormValidation.codeLength,
			message: `O código de verificação deve ter ${PasswordRecoveryFormValidation.codeLength} dígitos`
		},
		required: "O código de verificação é obrigatório"
	})

	return (
		<form
			className="w-4/5 max-w-screen-sm flex flex-col gap-3xl"
			onSubmit={handleSubmit(async ({ newPassword, email, code }) => {
				handleRecoverPasswordServerAction(recoverPassword({
					newPassword,
					email,
					code
				}))
			})}
		>
			{step !== "email" && (
				<Button
					className="self-start"
					size="compact-sm"
					color="white"
					variant="transparent"
					leftSection={<MdChevronLeft size="1.25rem" />}
					aria-label="Voltar para o formulário anterior"
					onClick={event => {
						event.preventDefault()
						setStep("email")
					}}
				>
					Voltar
				</Button>
			)}

			<header className="flex flex-col gap-xs">
				<h1 className="text-6xl font-extrabold">
					Recuperação de senha
				</h1>
				<h2 className="text-gray-500 text-3xl font-medium leading-relaxed tracking-tight" aria-live="polite">
					{step === "email"
						? "Informe seu e-mail para iniciar o processo de recuperação de senha."
						: <>
							Informe o código enviado para o seu e-mail para recuperar o acesso à sua conta.
							<br />
							<sub className="text-dark-200 text-2xl">
								Se você não recebeu o código, é possível que você não tenha uma conta no site.
							</sub>
						</>
					}
				</h2>
			</header>

			<div className="flex flex-col gap-2xl">
				<div className="flex flex-col gap-md">
					{step === "email" ? (
						<TextInput
							size="md"
							type="email"
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
								required: "O email é obrigatório"
							})}
							error={errors.email?.message}
							withAsterisk
							key="email"
						/>
					) : <>
						<label>
							<p className="text-md font-medium mb-xs">
								Digite o código enviado para o seu e-mail
								<span className="text-error" aria-hidden> *</span>
							</p>

							<PinInput
								gap="md"
								size="md"
								type={/^[0-9]*$/}
								inputType="number"
								inputMode="numeric"
								ariaLabel="Código de verificação"
								{...pick(code, ["name", "ref"] as const)}
								onChange={value => {
									setValue("code", value, {
										shouldValidate: false
									})
								}}
								onComplete={value => {
									setValue("code", value, {
										shouldValidate: true
									})

									setFocus("newPassword")
								}}
								error={!!errors.code?.message}
								manageFocus
								oneTimeCode
								length={PasswordRecoveryFormValidation.codeLength}
								key="code"
							/>
						</label>

						<TextInput
							size="md"
							type="password"
							label="Nova senha"
							autoComplete="new-password"
							placeholder="Digite uma nova senha"
							{...register("newPassword", {
								minLength: {
									value: GenericFormValidation.passwordMinLength,
									message: `A senha deve ter no mínimo ${GenericFormValidation.passwordMinLength} caracteres`
								},
								maxLength: {
									value: GenericFormValidation.passwordMaxLength,
									message: `A senha deve ter no máximo ${GenericFormValidation.passwordMaxLength} caracteres`
								},
								required: "A senha é obrigatória"
							})}
							error={errors.newPassword?.message}
							withAsterisk
							key="newPassword"
						/>
					</>}
				</div>

				<Button
					type="submit"
					variant="filled"
					loading={step === "email" ? isVerificationCodePending : isRecoverPasswordPending}
					aria-label="Enviar formulário"
					onClick={async event => {
						if(step === "code") return

						event.preventDefault()

						const isValid = await trigger("email")

						if(!isValid) return

						await handleVerificationCodeServerAction(sendVerificationCode(getValues("email")))
					}}
				>
					{step === "email" ? "Continuar" : "Enviar"}
				</Button>
			</div>
		</form>
	)
}
