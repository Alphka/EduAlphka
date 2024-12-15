"use server"

import type { z } from "zod"
import { revalidatePath } from "next/cache"
import { createExam } from "@lib/editExam"
import { redirect } from "next/navigation"
import getSessionUserData from "@helpers/getSessionUserData"
import examSchema from "@schemas/exam"
import routes from "@app/routes"

export default async function createExamAction(examData: z.infer<typeof examSchema>){
	try{
		const user = await getSessionUserData()
		const exam = createExam(user, examData)

		await exam.save()
	}catch(error){
		if(typeof error === "string") return { errors: [error] }
		if(Array.isArray(error)) return { errors: error as string[] }

		console.error(error)

		return { errors: ["Falha ao cadastrar o teste"] }
	}

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.template.pathname, "page")
	redirect(routes.homepage.pathname)

	// TODO: Add expiresAt input in front-end
	// expiresAt?: Date
}
