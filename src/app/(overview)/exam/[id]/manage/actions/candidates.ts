"use server"

import { revalidatePath } from "next/cache"
import { Types } from "mongoose"
import { Exam } from "@models"
import routes from "@app/routes"

export async function removeCandidate(examId: string, userId: string){
	const exam = await Exam.findById(examId, { candidates: 1 })

	if(!exam) return { errors: ["Teste não encontrado"] }

	const deleteIndexes: number[] = []

	exam.candidates.forEach((candidate, index) => {
		if(!candidate) deleteIndexes.push(index)
		else if((candidate instanceof Types.ObjectId ? candidate : candidate._id).equals(userId)) deleteIndexes.push(index)
	})

	for(const index of deleteIndexes.reverse()){
		exam.candidates.splice(index, 1)
	}

	exam.markModified("candidates")

	await exam.save()

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname, "page")
}
