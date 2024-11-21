import type { Model, ObjectId } from "mongoose"
import type { DateType } from "."

export interface ISubmit {
	user: ObjectId
	exam: ObjectId
	createdAt: DateType
}

export interface ISubmitMethods {
	getAnswers: () => any
}

export type SubmitModel = Model<ISubmit, {}, ISubmitMethods>
