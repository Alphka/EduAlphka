import GenericFormValidation from "./GenericFormValidation"

export default class ExamFormValidation {
	static readonly titleMinLength = GenericFormValidation.nameMinLength
	static readonly titleMaxLength = 255

	static readonly descriptionMinLength = GenericFormValidation.nameMinLength
	static readonly descriptionMaxLength = 355

	static readonly subjectMinLength = GenericFormValidation.nameMinLength
	static readonly subjectMaxLength = 45

	static readonly minDurationInMinutes = 5
	static readonly maxDurationInMinutes = 900 // 15 hours

	static readonly questionTextMinLength = 5
	static readonly questionTextMaxLength = 2000

	static readonly questionOptionMinLength = 1
	static readonly questionOptionMaxLength = 400

	static readonly minQuestionsNumber = 1
	static readonly maxQuestionsNumber = 100

	static readonly minOptionsNumber = 2
	static readonly maxOptionsNumber = 50

	static readonly answerContentMinLength = 1
	static readonly answerContentMaxLength = 2000

	static readonly submitFeedbackMinLength = 3
	static readonly submitFeedbackMaxLength = 1000
}
