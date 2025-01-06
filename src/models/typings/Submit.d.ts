import type { HydratedDocument, Model, PopulatedDoc, Types } from "mongoose"
import type { IAnswer } from "./Answer"
import type { IUser } from "./User"
import type { IExam } from "./Exam"

export interface ISubmit {
	_id: Types.ObjectId
	user: NonNullable<PopulatedDoc<IUser>>
	exam: NonNullable<PopulatedDoc<IExam>>
	createdAt: Date
	publishedAt?: Date
}

export interface ISubmitMethods {
	getAnswers: () => Promise<HydratedDocument<IAnswer>[]>
	isPendingCorrection: () => Promise<boolean>
}

export type SubmitModel = Model<ISubmit, {}, ISubmitMethods>
