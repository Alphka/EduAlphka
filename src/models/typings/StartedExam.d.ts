import type { HydratedDocument, Model, PopulatedDoc, Types } from "mongoose"
import type { IExam, IExamMethods } from "./Exam"
import type { IUser } from "./User"

export interface IStartedExam {
	_id: Types.ObjectId
	user: NonNullable<PopulatedDoc<IUser>>
	exam: NonNullable<PopulatedDoc<IExam>>
	createdAt: Date
}

export interface IStartedExamMethods {
	isExpired({ exam }?: {
		exam?: HydratedDocument<Pick<IExam, "expiresAt" | "duration">> & IExamMethods
	}): Promise<boolean>
}

export type StartedExamModel = Model<IStartedExam, {}, IStartedExamMethods>
