import type { Document, Model, PopulatedDoc, Types } from "mongoose"
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
		exam?: (Document & IExam)
		submit?: (Document & ISubmit) | null
	}): Promise<boolean>
}

export type StartedExamModel = Model<IStartedExam, {}, IStartedExamMethods>
