import type { Model, Types } from "mongoose"
import type { DateType } from "."

export interface ISubmit {
	user: Types.ObjectId
	exam: Types.ObjectId
	createdAt: DateType
}

export interface ISubmitMethods {
	getAnswers: () => any
}

export type SubmitModel = Model<ISubmit, {}, ISubmitMethods>
