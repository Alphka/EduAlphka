import type { Document, Model, Types } from "mongoose"
import type { ISubmit } from "./Submit"
import type { IExam } from "./Exam"

export interface IStartedExam {
	user: Types.ObjectId
	exam: Types.ObjectId
	startedAt: Date
}

export interface IStartedExamMethods {
	isExpired({ exam, submit }?: {
		exam?: (Document & IExam)
		submit?: (Document & ISubmit) | null
	}): Promise<boolean>
}

export type StartedExamModel = Model<IStartedExam, {}, IStartedExamMethods>
