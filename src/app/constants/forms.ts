export class GenericFormValidation {
	static readonly nameMinLength = 3
	static readonly nameMaxLength = 255

	static readonly usernameMinLength = 3
	static readonly usernameMaxLength = 30

	static readonly emailMinLength = 7
	static readonly emailMaxLength = 255

	static readonly passwordMinLength = 6
	static readonly passwordMaxLength = 255

	static readonly validNamePattern = "^[A-Za-záàâãäéèêëíïóôõöúüçñÁÀÂÃÄÉÈËÍÏÓÔÕÖÚÜÇÑ '.\\\\\\-]+$"
	static readonly validEmailPattern = "^([\\w!#$%&'*+\\/=?^`\\{\\|\\}~\\-]+(?:\\.[\\w!#$%&'*+\\/=?^`\\{\\|\\}~\\-]+)*@(?:[A-Za-z\\d](?:[A-Za-z\\d\\-]*[A-Za-z\\d])?\\.)+[A-Za-z\\d](?:[A-Za-z\\d\\-]*[A-Za-z\\d])?)$"
	static readonly validUsernamePattern = "^(\\w(?:(?:\\w|(?:\\.(?!\\.))){0,28}(?:\\w))?)"
	static readonly validPasswordPattern = "^[\\w~\`! @#$%^&*\\(\\)+=\\{\\}\\[\\]\\|\\;:\"<>,.\\/?\\-]+$"
}
