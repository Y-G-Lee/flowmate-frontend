import { ApiError } from './auth'
import { getAuth } from '../utils/auth'

export async function fetchDashboard() {
  const auth = getAuth()

  const response = await fetch('/api/dashboard', {
    method: 'GET',
    credentials: 'include',
    headers: auth?.accessToken
      ? { Authorization: `Bearer ${auth.accessToken}` }
      : {},
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || '대시보드 조회에 실패했습니다.',
    )
  }

  return data
}
