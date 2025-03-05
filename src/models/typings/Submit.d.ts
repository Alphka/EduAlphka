import type { Model, PopulatedDoc, Types } from "mongoose"
import type { IUser } from "./User"
import type { IExam } from "./Exam"

export interface ISubmit {
	_id: Types.ObjectId
	user: NonNullable<PopulatedDoc<IUser>>
	exam: NonNullable<PopulatedDoc<IExam>>
	createdAt: Date
	publishedAt?: Date
}

export type SubmitModel = Model<ISubmit>
