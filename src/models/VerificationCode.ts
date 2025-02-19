import type { VerificationCodeModel, IVerificationCode } from "./typings/VerificationCode"
import { PasswordRecoveryFormValidation } from "@constants/forms"
import { model, models, Schema } from "mongoose"

const verificationCodeSchema = new Schema<IVerificationCode>({
	user: {
		type: Schema.ObjectId,
		required: true,
		ref: "User"
	},
	code: {
		type: String,
		unique: true,
		minlegth: PasswordRecoveryFormValidation.codeLength,
		maxlength: PasswordRecoveryFormValidation.codeLength,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	expiresAt: {
		type: Date,
		required: true
	}
})

delete models?.VerificationCode

const VerificationCode: VerificationCodeModel = models?.VerificationCode || model<IVerificationCode, VerificationCodeModel>("VerificationCode", verificationCodeSchema)

export default VerificationCode
