import type { Dispatch, ReactNode, SetStateAction } from "react"
import { useContext } from "react"
import { toast } from "react-toastify"
import ColorSchemeContext from "@app/contexts/ColorScheme"

export default async function handleServerAction({
	promise,
	setLoading,
	successMessage
}: {
	promise: Promise<{ errors: string[] }> | Promise<{ errors: string[] } | undefined>
	setLoading: Dispatch<SetStateAction<boolean>>,
	successMessage?: ReactNode
}){
	const { colorScheme: theme } = useContext(ColorSchemeContext)

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
				toast.error("Algo deu errado", { theme })
			}
		}else{
			if(successMessage){
				toast.success("Algo deu errado", { theme })
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
