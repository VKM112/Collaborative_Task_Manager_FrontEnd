const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()

export const googleClientId = clientId

export const isGoogleLoginEnabled = Boolean(clientId)
