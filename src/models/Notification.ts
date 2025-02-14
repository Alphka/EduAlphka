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

})

const Notification = models?.Notification as NotificationModel || model<INotification, NotificationModel>("Notification", notificationSchema)

export default Notification
