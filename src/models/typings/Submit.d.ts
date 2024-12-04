import type { HydratedDocument, Model, Types } from "mongoose"
import type { IAnswer } from "./Answer"

export interface ISubmit {
	user: Types.ObjectId
	exam: Types.ObjectId
	createdAt: Date
}

export interface ISubmitMethods {
	getAnswers: () => HydratedDocument<IAnswer>
}

export type SubmitModel = Model<ISubmit, {}, ISubmitMethods>
