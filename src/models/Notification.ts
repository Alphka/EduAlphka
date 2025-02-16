import type { INotification, INotificationMethods, NotificationModel } from "./typings/Notification"
import { NotificationFormValidation } from "@constants/forms"
import { Schema, model, models } from "mongoose"

const notificationSchema = new Schema<INotification, NotificationModel, INotificationMethods>({
	user: {
		type: Schema.ObjectId,
		required: true,
		ref: "User"
	},
	title: {
		type: String,
		required: true,
		minlength: NotificationFormValidation.titleMinLength,
		maxlength: NotificationFormValidation.titleMaxLength
	},
	content: {
		type: String,
		required: true,
		minlength: NotificationFormValidation.contentMinLength,
		maxlength: NotificationFormValidation.contentMaxLength
	},
	exam: {
		type: Schema.ObjectId,
		ref: "Exam"
	},
	owner: {
		type: Schema.ObjectId,
		ref: "User"
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	readAt: Date
})

notificationSchema.method("markAsRead", async function markAsRead(){
	this.readAt = new Date
	this.markModified("readAt")
	await this.save()
})

const Notification = models?.Notification as NotificationModel || model<INotification, NotificationModel>("Notification", notificationSchema)

export default Notification
