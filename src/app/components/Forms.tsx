"use client"

import type { FocusEventHandler, FormEventHandler } from "react"
import { forwardRef, memo, useCallback, useState } from "react"
import { TextInput as MantineTextInput } from "@mantine/core"
import type { ComponentPropsWithoutRef } from "react"

const TextInput = memo(forwardRef<HTMLInputElement, ComponentPropsWithoutRef<typeof MantineTextInput>>(function TextInput(props, ref){
	const [inputError, setInputError] = useState<string | undefined>()

	const handleInvalid: FormEventHandler<HTMLInputElement> = useCallback(event => {
		event.preventDefault()

		const { currentTarget: input } = event
		const { validity } = input

		let message: string | undefined

		if(validity.valueMissing) message = "Esse campo é obrigatório"
		else if(validity.typeMismatch || validity.patternMismatch || validity.stepMismatch || validity.badInput) message = /^email$/i.test(input.type)
			? "Email inválido"
			: "Valor inválido para esse campo"
		else if(validity.tooLong || validity.tooShort) message = input.maxLength === -1
			? `Esse campo deve ter no mínimo ${input.minLength} caracteres`
			: input.minLength === -1
				? `Esse campo deve ter no máximo ${input.maxLength} caracteres`
				: `Esse campo deve ter no mínimo ${input.minLength} e no máximo ${input.maxLength} caracteres`
		else if(validity.rangeOverflow || validity.rangeUnderflow) message = input.max === ""
			? `O valor desse campo deve ser no mínimo ${input.min}`
			: input.min === ""
				? `O valor desse campo deve ser no máximo ${input.max}`
				: `O valor desse campo deve ser no mínimo ${input.min} e no máximo ${input.max}`
		else message = input.validationMessage

		input.setCustomValidity("")

		if(message) setInputError(message)
	}, [])

	const handleInput: FormEventHandler<HTMLInputElement> = useCallback(event => {
		const { currentTarget: input } = event

		input.setCustomValidity("")
		setInputError(undefined)
	}, [])

	const handleBlur: FocusEventHandler<HTMLInputElement> = useCallback(event => {
		event.currentTarget.checkValidity()
	}, [])

	return (
		<MantineTextInput
			type="text"
			onInvalid={handleInvalid}
			onInput={handleInput}
			onBlur={handleBlur}
			error={inputError}
			{...props}
			ref={ref}
		/>
	)
}))

export default TextInput
