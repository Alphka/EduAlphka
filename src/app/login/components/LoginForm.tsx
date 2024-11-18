"use client"

import type { typeToFlattenedError, ZodType } from "zod"
import { ActionIcon, Anchor, Button, Checkbox, TextInput } from "@mantine/core"
import { validPasswordPattern, type loginSchema } from "../constants"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { useActionState } from "react"
import { useState } from "react"
import authenticateUser from "../actions/login"
import Link from "next/link"

const initialState = {
	errors: {
		formErrors: [],
		fieldErrors: {}
	} satisfies typeToFlattenedError<ZodType<typeof loginSchema>>
}

export default function LoginForm(){
	const [state, formAction, isPending] = useActionState(authenticateUser, initialState)
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	const PasswordEyeIcon = isPasswordVisible ? MdVisibilityOff : MdVisibility

	return (
		<form
			className="w-10/12 max-w-screen-sm"
			action={formAction}
		>
			<fieldset className="flex flex-col gap-12">
				<header className="flex flex-col gap-2">
					<h1 className="text-4xl font-extrabold leading-none">Acesse sua conta</h1>
					<h2 className="text-neutral-700 dark:text-gray-400 text-xl font-normal leading-tight tracking-tight">Entre com seu endereço de e-mail ou nome usuário</h2>
				</header>

				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-4">
						<TextInput
							name="username"
							size="md"
							type="text"
							label="E-mail ou nome de usuário"
							placeholder="exemplo@exemplo.com"
							autoComplete="username"
							error={state.errors.fieldErrors.username?.[0]}
							withAsterisk={false}
							required
						/>
						<TextInput
							name="password"
							size="md"
							type={isPasswordVisible ? "text" : "password"}
							label="Senha"
							placeholder={isPasswordVisible ? "exemplo" : "•••••••"}
							autoComplete="current-password"
							pattern={validPasswordPattern}
							error={state.errors.fieldErrors.password?.[0]}
							rightSection={(
								<ActionIcon
									size="md"
									variant="subtle"
									className="text-current"
									onClick={() => setIsPasswordVisible(!isPasswordVisible)}
									onPointerDown={event => event.detail === 1 || event.preventDefault()}
								>
									<PasswordEyeIcon className="text-xl" />
								</ActionIcon>
							)}
							withAsterisk={false}
							required
						/>
					</div>

					<div className="flex items-center justify-between">
						<Checkbox
							name="keep_logged_in"
							size="sm"
							label="Manter conectado"
							defaultChecked
						/>

						<Anchor
							href="/recuperar-senha"
							className="px-0.5 rounded-sm"
							component={Link}
						>
							Esqueceu sua senha?
						</Anchor>
					</div>

					<Button
						type="submit"
						variant="filled"
						loading={isPending}
					>
						Enviar
					</Button>
				</div>

				<Anchor
					href="/recuperar-senha"
					className="self-center text-current text-center px-2 rounded-sm"
					component={Link}
					prefetch
				>
					Não tem uma conta? Crie uma agora mesmo!
				</Anchor>
			</fieldset>
		</form>
	)
}
