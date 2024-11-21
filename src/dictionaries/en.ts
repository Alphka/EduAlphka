import { GenericFormValidation } from "@app/constants/forms"
import { APPLICATION_NAME } from "@app/constants"

const en = {
	homepage: {
		title: "Home"
	},
	login: {
		title: "Login",
		description: `Login or register on the ${APPLICATION_NAME} platform `,
		form: {
			title: "Log into your account",
			subtitle: "Login with your email address or username",
			username: {
				label: "Email or username",
				placeholder:"example@example.com",
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
				label: "Keep logged in"
			},
			forgotYourPassword: {
				text: "Forgot your password?"
			},
			send: {
				text: "Send",
				accessibilityText: "Send form"
			},
			register: {
				text: "Don't have an account? Create one right now!",
				accessibilityText: "Create an account"
			},
			errors: {
				failedToAuthenticate: "Failed to authenticate user"
			}
		}
	},
	notFound: {
		title: "Page not found"
	}
}

export default en
