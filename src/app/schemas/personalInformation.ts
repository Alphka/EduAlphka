import { emailString, passwordString, usernameString } from "./login"
import { nameString } from "./signIn"
import { z } from "zod"

const personalInformationSchema = z.object({
	email: emailString.optional(),
	name: nameString.optional(),
	username: usernameString.optional(),
	password: passwordString.optional()
})

export default personalInformationSchema
