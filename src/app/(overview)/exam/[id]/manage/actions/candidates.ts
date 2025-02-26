"use server"

import { Exam, StartedExam, User } from "@models"
import { revalidatePath } from "next/cache"
import { Types } from "mongoose"
import getSessionUserData from "@helpers/getSessionUserData"
import connectDatabase from "@lib/connectDatabase"
import normalizeEmail from "normalize-email"
import routes from "@app/routes"

export async function addCandidate(examId: string, usernameOrEmail: string){
	if(!Types.ObjectId.isValid(examId)){
		return { errors: ["ID do teste inválido"] }
	}

	await connectDatabase()

	const user = await getSessionUserData()

	if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }
	if(user.accountType !== "professor") return { errors: ["Você não tem permissão para executar essa ação"] }

	const exam = await Exam.findById(examId, {
		owner: 1,
		candidates: 1,
		disallowedCandidates: 1,
		expiresAt: 1
	})

	if(!exam){
		return { errors: ["Teste não encontrado"] }
	}

	if(!exam.owner._id.equals(user.id)){
		return { errors: ["Você não tem permissão para executar essa ação"] }
	}

	if(exam.isExpired()){
		return { errors: ["O teste expirou. Não é possível adicionar novos candidatos"] }
	}

	const candidate = await User
		.findOne({
			$or: [
				...(usernameOrEmail.includes("@") ? [{ normalizedEmail: normalizeEmail(usernameOrEmail) }] : []),
				{ username: usernameOrEmail }
			]
		}, { accountType: 1 })
		.collation({ locale: "en", strength: 2 })

	if(!candidate) return { errors: ["Usuário não encontrado"] }
	if(candidate.accountType !== "candidate") return { errors: ["Este usuário não é um candidato"] }

	if(exam.candidates.includes(candidate._id)){
		return { errors: ["Candidato já adicionado ao teste"] }
	}

	if(exam.disallowedCandidates.includes(candidate._id)){
		return { errors: ["Esse candidato está desativado do teste"] }
	}

	await exam.updateOne({
		$addToSet: {
			candidates: candidate._id
		}
	})

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.list.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", examId))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", examId))
}

export async function removeCandidate(examId: string, userId: string, disable = false){
	if(!Types.ObjectId.isValid(examId)){
		return { errors: ["ID do teste inválido"] }
	}

	await connectDatabase()

	const user = await getSessionUserData()

	if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }
	if(user.accountType !== "professor") return { errors: ["Você não tem permissão para executar essa ação"] }

	const exam = await Exam.findById(examId, { owner: 1 })

	if(!exam){
		return { errors: ["Teste não encontrado"] }
	}

	if(!exam.owner._id.equals(user.id)){
		return { errors: ["Você não tem permissão para executar essa ação"] }
	}

	const startedExam = await StartedExam.findOne({
		exam,
		user: userId,
		duration: 1,
		createdAt: 1,
		expiresAt: 1
	}, { _id: 1 })

	if(startedExam && !(await startedExam.isExpired({ exam }))){
		return { errors: [`Não é possível ${disable ? "desativar" : "remover"} um candidato que já iniciou o teste`] }
	}

	await exam.updateOne({
		...(disable && {
			$addToSet: {
				disallowedCandidates: userId
			}
		}),
		$pull: {
			candidates: userId
		}
	})

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.list.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", examId))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", examId))
}

export async function enableCandidate(examId: string, userId: string){
	if(!Types.ObjectId.isValid(examId)){
		return { errors: ["ID do teste inválido"] }
	}

	await connectDatabase()

	const user = await getSessionUserData()

	if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }
	if(user.accountType !== "professor") return { errors: ["Você não tem permissão para executar essa ação"] }

	const exam = await Exam.findById(examId, { owner: 1 })

	if(!exam){
		return { errors: ["Teste não encontrado"] }
	}

	if(!exam.owner._id.equals(user.id)){
		return { errors: ["Você não tem permissão para executar essa ação"] }
	}

	await exam.updateOne({
		$addToSet: {
			candidates: userId
		},
		$pull: {
			disallowedCandidates: userId
		}
	})

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.list.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", examId))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", examId))
}
