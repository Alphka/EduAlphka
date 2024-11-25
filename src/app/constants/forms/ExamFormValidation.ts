export default class ExamFormValidation {
	static readonly titleMinLength = 3
	static readonly titleMaxLength = 255

	static readonly descriptionMinLength = 3
	static readonly descriptionMaxLength = 355

	static readonly minDurationInMinutes = 5
	static readonly maxDurationInMinutes = 7
}
