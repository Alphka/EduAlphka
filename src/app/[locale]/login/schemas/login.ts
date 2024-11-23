import type { Dictionary } from "@dictionaries"
import { GenericFormValidation } from "@constants/forms"
import { z } from "zod"

export default function getLoginSchema(dictionary: Dictionary){
	return z.object({
		email: z.string({ invalid_type_error: dictionary.inputs.email.validations.invalid })
			.trim()
			.toLowerCase()
			.min(GenericFormValidation.emailMinLength, dictionary.inputs.email.validations.max)
			.max(GenericFormValidation.emailMaxLength, dictionary.inputs.email.validations.min)
			.email(dictionary.inputs.email.validations.invalidPattern)
			.regex(new RegExp(GenericFormValidation.validEmailPattern), dictionary.inputs.email.validations.invalidPattern)
			.optional(),
		username: z.string({ invalid_type_error: dictionary.inputs.username.validations.invalid })
			.trim()
			.min(GenericFormValidation.usernameMinLength, dictionary.inputs.username.validations.max)
			.max(GenericFormValidation.usernameMaxLength, dictionary.inputs.username.validations.min)
			.regex(new RegExp(GenericFormValidation.validUsernamePattern), dictionary.inputs.username.validations.invalidPattern)
			.optional(),
		password: z.string({ invalid_type_error: dictionary.inputs.password.validations.invalid })
			.trim()
			.min(GenericFormValidation.passwordMinLength, dictionary.inputs.password.validations.min)
			.max(GenericFormValidation.passwordMaxLength, dictionary.inputs.password.validations.max)
			.regex(new RegExp(GenericFormValidation.validPasswordPattern), dictionary.inputs.password.validations.invalidPattern),
		keep_logged_in: z.enum(["on", "off"]).optional()
	})
}
