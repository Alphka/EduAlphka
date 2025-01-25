"use server"

import type { FilterQuery } from "mongoose"
import type { IUser } from "@models/typings/User"
import { identity, pickBy } from "lodash"
import { revalidatePath } from "next/cache"
import { User } from "@models"
import personalInformationSchema from "@schemas/personalInformation"
import getSessionUserData from "@helpers/getSessionUserData"
import connectDatabase from "@lib/connectDatabase"
import normalizeEmail from "normalize-email"
import routes from "@app/routes"

export interface PersonalInformationData {
	password?: string
	username: string
	email: string
	name: string
}

export default async function editPersonalInformation(
	currentPassword: string,
	{ name, email, username, password }: Partial<PersonalInformationData> = {}
){
	try{
		await connectDatabase()

		const user = await getSessionUserData(true)

		if(!user){
			return { errors: ["Você precisa estar logado para executar essa ação"] }
		}

		if(!user.validatePassword(currentPassword)){
			return { errors: ["Credenciais inválidas"] }
		}

		const validatedFields = personalInformationSchema.safeParse({
			name,
			email,
			username,
			password
		})

		if(!Object.keys(validatedFields).length || !Object.values(validatedFields).filter(Boolean).length){
			return { errors: ["Nenhum campo foi preenchido"] }
		}

		if(!validatedFields.success){
			return {
				errors: validatedFields.error.errors.map(error => error.message)
			}
		}

		if(validatedFields.data.email){
			const normalizedEmail = validatedFields.data.email && normalizeEmail(validatedFields.data.email)

			if(normalizedEmail && normalizedEmail === user.normalizedEmail) email = undefined
			else email = validatedFields.data.email
		}

		if(validatedFields.data.username){
			if(validatedFields.data.username === user.username) username = undefined
			else username = validatedFields.data.username
		}

		if(email || username){
			const existingUser = await User.exists({
				$or: [
					username ? { username } : undefined,
					email ? { normalizedEmail: normalizeEmail(email) } : undefined
				].filter(Boolean) as FilterQuery<IUser>[]
			})

			if(existingUser){
				return { errors: ["Já existe um usuário com esse nome de usuário ou email"] }
			}
		}

		Object.assign(user, pickBy({
			name,
			email,
			normalizedEmail: email && normalizeEmail(email),
			username,
			password: password && User.hashPassword(password)
		}, identity))

		if(!user.isModified()){
			return { errors: ["Nenhum campo foi alterado"] }
		}

		user.updatedAt = new Date
		await user.save()
	}catch(error){
		if(typeof error === "string") return { errors: [error] }
		if(Array.isArray(error)) return { errors: error as string[] }

		console.error(error)

		return { errors: ["Falha ao editar os dados do usuário"] }
	}

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.account.pathname)
	revalidatePath(routes.exam.children.template.pathname, "page")
	revalidatePath(routes.exam.children.template.children.manage.pathname, "page")
	revalidatePath(routes.exam.children.template.children.submit.pathname, "page")
	revalidatePath(routes.invite.children.template.pathname, "page")
	revalidatePath(routes.submit.children.template.pathname, "page")
}
