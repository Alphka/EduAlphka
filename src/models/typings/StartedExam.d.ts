import type { HydratedDocument, Model, PopulatedDoc, Types } from "mongoose"
import type { IExam, IExamMethods } from "./Exam"
import type { ISubmit } from "./Submit"
import type { IUser } from "./User"

export interface IStartedExam {
	_id: Types.ObjectId
	user: NonNullable<PopulatedDoc<IUser>>
	exam: NonNullable<PopulatedDoc<IExam>>
	startedAt: Date
}

export interface IStartedExamMethods {
	isExpired({ exam, submit }?: {
		exam?: HydratedDocument<Pick<IExam, "expiresAt" | "duration">> & IExamMethods
		submit?: HydratedDocument<ISubmit> | boolean | null
	}): Promise<boolean>
}

export type StartedExamModel = Model<IStartedExam, {}, IStartedExamMethods>
