import { ApiError } from './auth'
import { getAuth } from '../utils/auth'

function authHeaders() {
  const auth = getAuth()
  return auth?.accessToken
    ? { Authorization: `Bearer ${auth.accessToken}` }
    : {}
}

export function formatUserLabel(user) {
  if (!user) return ''
  return `${user.name} (${user.email})`
}

export async function searchUsers(keyword) {
  const trimmed = keyword?.trim()
  if (!trimmed) return []

  const params = new URLSearchParams({ keyword: trimmed })
  const response = await fetch(`/api/users/search?${params.toString()}`, {
    credentials: 'include',
    headers: authHeaders(),
  })

  const data = await response.json().catch(() => ([]))

  if (!response.ok) {
    throw new ApiError(response.status, data.message || '사용자 검색에 실패했습니다.')
  }

  return Array.isArray(data) ? data : []
}
