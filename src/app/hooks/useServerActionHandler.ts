"use client"

import { useState } from "react"
import { toast } from "react-toastify"

type ServerActionPromise = Promise<{ errors: string[] } | undefined>

type ToastOptions = Pick<import("react-toastify").ToastOptions, "autoClose">

type Options =  & ToastOptions

interface ServerActionHandlerProps extends ToastOptions {
	successOptions?: Partial<{
		message: string
	}> & Options
	errorOptions?: Options
}

export default function useServerActionHandler({ successOptions = {}, errorOptions = {} }: ServerActionHandlerProps = {}){
	const [isPending, setIsPending] = useState(false)

	const options = (isError: boolean): ToastOptions => {
		const options = isError ? errorOptions : successOptions

		return {
			autoClose: options.autoClose
		}
	}

	return {
		async handleServerAction(promise: ServerActionPromise){
			setIsPending(true)

			const result = await promise

			if(result){
				if("errors" in result && result.errors.length){
					for(const error of result.errors){
						toast.error(error, options(true))
					}
				}else{
					console.error("Server action failed:", result)
					toast.error("Algo deu errado", options(true))
				}
			}else{
				if(successOptions.message){
					toast.success(successOptions.message, options(false))
				}
			}

			setIsPending(false)
		},
		isPending
	}
}
