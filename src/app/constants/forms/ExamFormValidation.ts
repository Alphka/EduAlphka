import GenericFormValidation from "./GenericFormValidation"

export default class ExamFormValidation {
	static readonly titleMinLength = GenericFormValidation.nameMinLength
	static readonly titleMaxLength = 255

	static readonly descriptionMinLength = GenericFormValidation.nameMinLength
	static readonly descriptionMaxLength = 355

	static readonly subjectMinLength = GenericFormValidation.nameMinLength
	static readonly subjectMaxLength = 255

	static readonly minDurationInMinutes = 5
	static readonly maxDurationInMinutes = 420 // 7 hours

	static readonly questionTextMinLength = 5
	static readonly questionTextMaxLength = 2000
}
