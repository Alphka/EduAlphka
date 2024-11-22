import type { Dictionary } from "@app/[locale]/dictionaries"
import { GenericFormValidation } from "@app/constants/forms"
import { ACCOUNT_TYPES } from "@models/User"
import { z } from "zod"

export default function getSignInSchema(dictionary: Dictionary){
	return z.object({
		name: z.string({ invalid_type_error: dictionary.inputs.name.validations.invalid })
			.trim()
			.min(GenericFormValidation.nameMinLength, dictionary.inputs.name.validations.max)
			.max(GenericFormValidation.nameMaxLength, dictionary.inputs.name.validations.min)
			.regex(new RegExp(GenericFormValidation.validNamePattern), dictionary.inputs.name.validations.invalidPattern),
		username: z.string({ invalid_type_error: dictionary.inputs.username.validations.invalid })
			.trim()
			.min(GenericFormValidation.usernameMinLength, dictionary.inputs.username.validations.max)
			.max(GenericFormValidation.usernameMaxLength, dictionary.inputs.username.validations.min)
			.regex(new RegExp(GenericFormValidation.validUsernamePattern), dictionary.inputs.username.validations.invalidPattern),
		email: z.string({ invalid_type_error: dictionary.inputs.email.validations.invalid })
			.trim()
			.toLowerCase()
			.min(GenericFormValidation.emailMinLength, dictionary.inputs.email.validations.max)
			.max(GenericFormValidation.emailMaxLength, dictionary.inputs.email.validations.min)
			.email(dictionary.inputs.email.validations.invalidPattern)
			.regex(new RegExp(GenericFormValidation.validEmailPattern), dictionary.inputs.email.validations.invalidPattern),
		password: z.string({ invalid_type_error: dictionary.inputs.password.validations.invalid })
			.trim()
			.min(GenericFormValidation.passwordMinLength, dictionary.inputs.password.validations.min)
			.max(GenericFormValidation.passwordMaxLength, dictionary.inputs.password.validations.max)
			.regex(new RegExp(GenericFormValidation.validPasswordPattern), dictionary.inputs.password.validations.invalidPattern),
		account_type: z.enum(ACCOUNT_TYPES, { invalid_type_error: dictionary.inputs.accountType.validations.invalid }),
		keep_logged_in: z.enum(["on", "off"]).optional()
	})
}
