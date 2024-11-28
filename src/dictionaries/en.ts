import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { APPLICATION_NAME } from "@constants"

const en = {
	homepage: {
		title: "Dashboard",
		examButton: {
			text: "Create exam"
		}
	},
	exam: {
		createForm: {
			title: "Create exam",
			form: {
				examData: {
					title: "Exam data"
				}
			}
		}
	},
	login: {
		title: "Login",
		description: `Login or register on the ${APPLICATION_NAME} platform`,
		form: {
			title: "Log into your account",
			subtitle: "Login with your email address or username",
			forgotYourPassword: {
				text: "Forgot your password?"
			},
			send: {
				text: "Submit",
				accessibilityText: "Log into the account"
			},
			register: {
				text: "Don't have an account? Create one right now!",
				accessibilityText: "Create an account"
			},
			errors: {
				invalidCredentials: "Invalid credentials",
				failedToAuthenticate: "Failed to authenticate user"
			}
		}
	},
	logout: {
		title: "Logout"
	},
	register: {
		title: "Sign-in",
		description: `Sign-in on the ${APPLICATION_NAME} platform`,
		form: {
			title: "Create an account",
			subtitle: "Join our online testing platform and start your learning journey!",
			send: {
				text: "Submit",
				accessibilityText: "Create account"
			},
			errors: {
				emailAlreadyInUse: "This email is already in use",
				usernameAlreadyInUse: "This username is already in use",
				credentialsAlreadyInUse: "These credentials are already in use",
				failedToRegister: "Failed to register user"
			}
		}
	},
	notFound: {
		title: "Page not found"
	},
	inputs: {
		name: {
			label: "Name",
			placeholder: "Type your name",
			validations: {
				invalid: "Invalid name",
				min: `The name must be at least ${GenericFormValidation.nameMinLength} characters long`,
				max: `The name must must have a maximum of ${GenericFormValidation.nameMaxLength} characters`,
				invalidPattern: "The name contains invalid characters"
			}
		},
		email: {
			label: "Email",
			placeholder:"Type your email address",
			validations: {
				invalid: "Invalid email",
				min: `The email must be at least ${GenericFormValidation.emailMinLength} characters long`,
				max: `The email must must have a maximum of ${GenericFormValidation.emailMaxLength} characters`,
				invalidPattern: "The email contains invalid characters"
			}
		},
		username: {
			label: "Username",
			placeholder: "Type your username",
			validations: {
				invalid: "Invalid username",
				min: `The username must be at least ${GenericFormValidation.usernameMinLength} characters long`,
				max: `The username must must have a maximum of ${GenericFormValidation.usernameMaxLength} characters`,
				invalidPattern: "The username contains invalid characters"
			}
		},
		emailOrUsername: {
			label: "Email or username",
			placeholder:"Type your email or username",
			validations: {
				invalid: "Invalid email or username",
				min: `The email or username must be at least ${Math.min(GenericFormValidation.emailMinLength, GenericFormValidation.usernameMinLength)} characters long`,
				max: `The email or username must must have a maximum of ${Math.max(GenericFormValidation.emailMaxLength, GenericFormValidation.usernameMaxLength)} characters`,
				invalidPattern: "The email or username contains invalid characters"
			}
		},
		password: {
			label: "Password",
			placeholder: "example",
			eye: {
				show: "Show password",
				hide: "Hide password"
			},
			validations: {
				invalid: "Invalid password",
				min: `The password must be at least ${GenericFormValidation.passwordMinLength} characters long`,
				max: `The password must have a maximum of ${GenericFormValidation.passwordMaxLength} characters`,
				invalidPattern: "The password contains invalid characters"
			}
		},
		keepLoggedIn: {
			label: "Keep me logged in"
		},
		accountType: {
			label: "Account type",
			professor: {
				text: "Professor"
			},
			candidate: {
				text: "Candidate"
			},
			validations: {
				invalid: "Invalid account type"
			}
		},
		examTitle: {
			label: "Title",
			placeholder: "Exam title",
			validations: {
				invalid: "Invalid exam title",
				min: `The exam title must be at least ${ExamFormValidation.titleMinLength} characters long`,
				max: `The exam title must have a maximum of ${ExamFormValidation.titleMaxLength} characters`,
				invalidPattern: "The exam title contains invalid characters"
			}
		},
		examDescription: {
			label: "Description",
			placeholder: "Exam description",
			validations: {
				invalid: "Invalid exam description",
				min: `The exam description must be at least ${ExamFormValidation.descriptionMinLength} characters long`,
				max: `The exam description must have a maximum of ${ExamFormValidation.descriptionMaxLength} characters`,
				invalidPattern: "The exam description contains invalid characters"
			}
		},
		examDuration: {
			label: "Duration",
			placeholder: "Exam duration",
			validations: {
				invalid: "Invalid exam duration",
				min: `The exam duration must be at least ${ExamFormValidation.minDurationInMinutes} characters long`,
				max: `The exam duration must have a maximum of ${ExamFormValidation.maxDurationInMinutes} characters`,
				invalidPattern: "The exam duration must contain only numbers"
			}
		}
	},
	genericErrors: {
		somethingWentWrong: "Something went wrong"
	}
}

export default en
