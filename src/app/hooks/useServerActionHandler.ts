"use client"

import type { ReactNode } from "react"
import { useContext, useState } from "react"
import { getDictionary } from "@dictionaries"
import { useParams } from "next/navigation"
import { toast } from "react-toastify"
import ColorSchemeContext from "@contexts/ColorScheme"

type ServerActionPromise = Promise<{ errors: string[] } | undefined>

interface ServerActionHandlerProps {
	successMessage?: ReactNode
}

export default function useServerActionHandler({ successMessage }: ServerActionHandlerProps = {}){
	const { colorScheme: theme } = useContext(ColorSchemeContext)
	const { locale } = useParams()

	const [isPending, setIsPending] = useState(false)

	return {
		async handleServerAction(promise: ServerActionPromise){
			setIsPending(true)

			const result = await promise

			if(result){
				if("errors" in result && result.errors.length){
					for(const error of result.errors){
						toast.error(error, { theme })
					}
				}else{
					console.error("Server action failed:", result)

					const dictionary = await getDictionary(locale as string)
					toast.error(dictionary.genericErrors.somethingWentWrong, { theme })
				}
			}else{
				if(successMessage){
					toast.success(successMessage, { theme })
				}
			}

			setIsPending(false)
		},
		isPending
	}
}
