const AUTH_KEY = 'flowmate_auth'

export function setAuth({ id, name, email, accessToken }) {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ id, name, email, accessToken }),
  )
}

export function getAuth() {
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY)
}

export function isAuthenticated() {
  return getAuth() !== null
}
