import type { Document, Model, PopulatedDoc } from "mongoose"
import type { ISubmit } from "./Submit"
import type { IExam } from "./Exam"
import type { IUser } from "./User"

export interface IStartedExam {
	user: NonNullable<PopulatedDoc<IUser>>
	exam: NonNullable<PopulatedDoc<IExam>>
	startedAt: Date
}

export interface IStartedExamMethods {
	isExpired({ exam, submit }?: {
		exam?: Document & IExam
		submit?: (Document & ISubmit) | boolean | null
	}): Promise<boolean>
}

export type StartedExamModel = Model<IStartedExam, {}, IStartedExamMethods>
