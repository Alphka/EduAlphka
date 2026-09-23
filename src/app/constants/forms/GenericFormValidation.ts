export default class GenericFormValidation {
	static readonly nameMinLength = 3
	static readonly nameMaxLength = 255

	static readonly usernameMinLength = 3
	static readonly usernameMaxLength = 30

	static readonly emailMinLength = 7
	static readonly emailMaxLength = 255

	static readonly passwordMinLength = 6
	static readonly passwordMaxLength = 255

	static readonly validNameChars = "A-Za-zÀ-ÖØ-Þß-öø-ÿÑÇĶñçķᵈªᵃºᵒ '.\\\\\\-"
	static readonly validSpecialNameChars = `${this.validNameChars}0-9@&\\/` as const
	static readonly validDescriptionChars = `${this.validSpecialNameChars}\\*\\+×÷⁰¹²³⁴⁵⁶⁷⁸⁹ᴬᴮᴰᴱᴳᴴᴵᴶᴷᴸᴹᴺᴵᴼᴾᴿᵀᵁᵂ⁻ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿⁱᵒᵖʳˢᵗᵘᵛʷˣʸᶻπ!"#$%'\\(\\)*+,.;<=>?\\]^_\`\\|\\{\\}~:“”©™®•\\t\\n` as const
	static readonly validSpecialNamePattern = `^[${this.validSpecialNameChars}]+$` as const
	static readonly validDescriptionPattern = `^[${this.validDescriptionChars}]+$` as const

	static readonly validNamePattern = `^[${this.validNameChars}]+$` as const
	static readonly validEmailPattern = "^([\\w!#$%&'*+\\/=?^`\\{\\|\\}~\\-]+(?:\\.[\\w!#$%&'*+\\/=?^`\\{\\|\\}~\\-]+)*@(?:[A-Za-z\\d](?:[A-Za-z\\d\\-]*[A-Za-z\\d])?\\.)+[A-Za-z\\d](?:[A-Za-z\\d\\-]*[A-Za-z\\d])?)$"
	static readonly validUsernamePattern = "^(\\w(?:(?:\\w|(?:\\.(?!\\.))){0,28}(?:\\w))?)"
	static readonly validPasswordPattern = "^[\\w~`! @#$%^&*\\(\\)+=\\{\\}\\[\\]\\|\\;:\"<>,.\\/?\\-]+$"
}
