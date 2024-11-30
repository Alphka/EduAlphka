"use client"

import type { IUser } from "@models/typings/User"
import { createContext } from "react"

export interface BaseCredentials {
	id: string
}

export interface UserCredentials extends BaseCredentials, IUser {}

const CredentialsContext = createContext<{ user: UserCredentials }>({
	user: {
		id: "",
		name: "",
		email: "",
		username: "",
		password: "",
		createdAt: "",
		accountType: "candidate",
		startedTests: []
	}
})

export default CredentialsContext
