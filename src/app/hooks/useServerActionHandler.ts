"use client"

import { useState, type ReactNode } from "react"
import { toast } from "react-toastify"

type ServerActionPromise = Promise<{ errors: string[] } | undefined>

interface ServerActionHandlerProps {
	successMessage?: ReactNode
}

export default function useServerActionHandler({ successMessage }: ServerActionHandlerProps = {}){
	const [isPending, setIsPending] = useState(false)

	return {
		async handleServerAction(promise: ServerActionPromise){
			setIsPending(true)

			const result = await promise

			if(result){
				if("errors" in result && result.errors.length){
					for(const error of result.errors){
						toast.error(error)
					}
				}else{
					console.error("Server action failed:", result)
					toast.error("Algo deu errado")
				}
			}else{
				if(successMessage){
					toast.success(successMessage)
				}
			}

			setIsPending(false)
		},
		isPending
	}
}
