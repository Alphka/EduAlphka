import type { IQuestionOption, OptionModel } from "../typings/Exam"
import { Schema } from "mongoose"

export const OptionSchema = new Schema<IQuestionOption, OptionModel>({
	text: {
		type: String,
		required: true
	}
})
