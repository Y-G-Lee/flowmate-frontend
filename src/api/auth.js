export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

async function parseErrorMessage(response, data) {
  if (data?.message) return data.message
  if (response.status === 403) {
    return '서버 접근이 거부되었습니다. 백엔드 CORS/Security 설정을 확인해 주세요.'
  }
  return '요청에 실패했습니다. 다시 시도해 주세요.'
}

export async function checkEmailDuplicate(email) {
  const params = new URLSearchParams({ email: email.trim() })
  const response = await fetch(`/api/auth/email/check?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      response.status,
      await parseErrorMessage(response, data),
    )
  }

  return { isAvailable: data.available }
}

export async function signup({ name, email, password }) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      password,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      response.status,
      await parseErrorMessage(response, data),
    )
  }

  return data
}

export async function login({ email, password }) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      response.status,
      await parseErrorMessage(response, data),
    )
  }

  return data
}
