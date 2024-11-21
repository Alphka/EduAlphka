import type { Dictionary } from "@app/[locale]/dictionaries"
import { GenericFormValidation } from "@app/constants/forms"
import { z } from "zod"

export default function getLoginSchema(dictionary: Dictionary["login"]["form"]){
	return z.object({
		username: z.string({ invalid_type_error: dictionary.username.validations.invalid })
			.min(Math.min(GenericFormValidation.emailMinLength, GenericFormValidation.usernameMinLength), dictionary.username.validations.max)
			.max(Math.max(GenericFormValidation.emailMaxLength, GenericFormValidation.usernameMaxLength), dictionary.username.validations.min)
			.regex(new RegExp(GenericFormValidation.validUsernamePattern), dictionary.username.validations.invalidPattern),
		password: z.string({ invalid_type_error: dictionary.password.validations.invalid })
			.min(GenericFormValidation.passwordMinLength, dictionary.password.validations.min)
			.max(GenericFormValidation.passwordMaxLength, dictionary.password.validations.max)
			.regex(new RegExp(GenericFormValidation.validPasswordPattern), dictionary.password.validations.invalidPattern),
		keep_logged_in: z.enum(["on", "off"]).optional()
	})
}
