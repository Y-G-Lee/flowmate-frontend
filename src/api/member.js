import { ApiError } from './auth'
import { getAuth } from '../utils/auth'

function authHeaders() {
  const auth = getAuth()
  return auth?.accessToken
    ? { Authorization: `Bearer ${auth.accessToken}` }
    : {}
}

async function request(url, options = {}, errorMessage = '요청에 실패했습니다.') {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      ...authHeaders(),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (response.status === 204) {
    return null
  }

  if (!response.ok) {
    throw new ApiError(response.status, data.message || errorMessage)
  }

  return data
}

export function mapProjectMember(member) {
  if (!member) return null

  return {
    id: member.userId,
    userId: member.userId,
    name: member.nickname,
    nickname: member.nickname,
    email: member.email,
    role: member.role,
    joinedAt: member.joinedAt,
    avatar: member.nickname?.charAt(0) ?? '?',
  }
}

export const mapMember = mapProjectMember

export async function fetchProjectMembers(projectId) {
  const data = await request(
    `/api/projects/${projectId}/members`,
    {},
    '프로젝트 멤버 조회에 실패했습니다.',
  )
  return data.map(mapProjectMember)
}

export async function addProjectMember(projectId, userId) {
  const data = await request(
    `/api/projects/${projectId}/members`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    },
    '프로젝트 멤버 추가에 실패했습니다.',
  )
  return mapProjectMember(data)
}

export async function inviteProjectMember(projectId, { userId }) {
  return addProjectMember(projectId, Number(userId))
}

export async function removeProjectMember(projectId, userId) {
  await request(
    `/api/projects/${projectId}/members/${userId}`,
    { method: 'DELETE' },
    '프로젝트 멤버 삭제에 실패했습니다.',
  )
}
