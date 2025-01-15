"use server"

import { revalidatePath } from "next/cache"
import routes from "@app/routes"

export default async function revalidateSubmitCache(id: string){
	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", id))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", id))
}
