import type { Model, PopulatedDoc, Types } from "mongoose"
import type { IExam } from "./Exam"
import type { IUser } from "./User"

export interface INotification {
	_id: Types.ObjectId
	title: string
	user: NonNullable<PopulatedDoc<IUser>>
	exam?: PopulatedDoc<IExam>
	owner?: PopulatedDoc<IUser>
	content: string
	createdAt: Date
	readAt?: Date
}

export interface INotificationMethods {
	markAsRead(): void
}

type NotificationModel = Model<INotification, {}, INotificationMethods>
