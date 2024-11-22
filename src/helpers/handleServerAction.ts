import type { Dispatch, ReactNode, SetStateAction } from "react"
import type { Dictionary } from "@app/[locale]/dictionaries"
import type { Themes } from "@app/contexts/ColorScheme"
import { toast } from "react-toastify"

interface ServerActionHandlerProps {
	promise: Promise<{ errors: string[] }> | Promise<{ errors: string[] } | undefined>
	setLoading: Dispatch<SetStateAction<boolean>>,
	dictionary: Dictionary
	colorScheme: Themes
	successMessage?: ReactNode
}

export default async function handleServerAction({
	colorScheme: theme,
	successMessage,
	dictionary,
	setLoading,
	promise
}: ServerActionHandlerProps){
	try{
		setLoading(true)

		const result = await promise

		if(result){
			if("errors" in result && result.errors.length){
				for(const error of result.errors){
					toast.error(error, { theme })
				}
			}else{
				console.error("Server action failed:", result)
				toast.error(dictionary.genericErrors.somethingWentWrong, { theme })
			}
		}else{
			if(successMessage){
				toast.success(dictionary.genericErrors.somethingWentWrong, { theme })
			}
		}
	}catch(error){
		if(typeof error === "string"){
			toast.error(error, { theme })
		}else if(error instanceof Error){
			toast.error(error.message, { theme })
		}

		console.error(error)
	}finally{
		setLoading(false)
	}
}
