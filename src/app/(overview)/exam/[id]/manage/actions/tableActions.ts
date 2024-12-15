"use server"

import { Types } from "mongoose"
import { Exam } from "@models"

export async function removeExamCandidate(examId: string, userId: string){
	const exam = await Exam
		.findById(examId, {
			candidates: 1
		})

	if(!exam) return { errors: ["Teste não encontrado"] }

	const deleteIndexes: number[] = []

	exam.candidates.forEach((candidate, index) => {
		if(!candidate) deleteIndexes.push(index)
		else if((candidate instanceof Types.ObjectId ? candidate : candidate._id).equals(userId)) deleteIndexes.push(index)
	})

	for(const index of deleteIndexes.reverse()){
		exam.candidates.splice(index, 1)
	}

	await exam.save()
}
