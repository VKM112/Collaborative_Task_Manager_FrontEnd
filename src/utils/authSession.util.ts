const STORAGE_KEY = 'taskflow:forcedLogout'

export const setForcedLogout = () => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, 'true')
}

export const clearForcedLogout = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}

export const isForcedLogout = () => {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEY) === 'true'
}
