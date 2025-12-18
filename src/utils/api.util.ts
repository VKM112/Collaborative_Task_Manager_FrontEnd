import type { AxiosError } from 'axios'

export function getErrorMessage(error?: unknown) {
  if (!error) return undefined
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message
  }
  if (error instanceof Error) return error.message
  return String(error)
}
