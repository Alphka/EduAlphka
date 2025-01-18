const isDevelopment = process.env.NODE_ENV === "development"

export const APPLICATION_NAME = "EduAlphka"
export const TOKEN_KEY = isDevelopment ? APPLICATION_NAME.toLowerCase() + "-token" : "token"
export const TOKEN_LENGTH = 96
export const EMAIL_VERIFICATION_TIMEOUT = 30e3
