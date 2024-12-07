"use server"

import type { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Exam } from "@models"
import getSessionUserData from "@helpers/getSessionUserData"
import examSchema from "@schemas/exam"
import editExam from "@lib/editExam"
import routes from "@app/routes"

export default async function editExamAction(id: string, examData: z.infer<typeof examSchema>){
	try{
		const [user, exam] = await Promise.all([
			getSessionUserData(),
			Exam.findById(id)
		])

		console.log(user, exam, examData)

		editExam(user, exam, examData)

		await exam!.save()
	}catch(error){
		if(typeof error === "string") return { errors: [error] }
		if(Array.isArray(error)) return { errors: error as string[] }

		console.error(error)

		return { errors: ["Falha ao cadastrar o teste"] }
	}

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.pathname)
	revalidatePath(routes.exam.children.template.pathname, "page")
	redirect(routes.homepage.pathname)
}
