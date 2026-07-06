import { ApiError } from './auth'
import { getAuth } from '../utils/auth'

function authHeaders() {
  const auth = getAuth()
  return auth?.accessToken
    ? { Authorization: `Bearer ${auth.accessToken}` }
    : {}
}

export function mapTeam(team) {
  if (!team) return null

  return {
    id: team.id,
    name: team.name,
    description: team.description ?? '',
    memberCount: team.memberCount ?? 0,
    projectCount: team.projectCount ?? 0,
  }
}

function mapTeamMember(member) {
  if (!member) return null

  return {
    userId: member.userId,
    name: member.name ?? member.nickname ?? '',
    email: member.email ?? '',
    teamRole: member.teamRole ?? 'MEMBER',
    joinedAt: member.joinedAt ?? null,
  }
}

function mapTeamProject(project) {
  if (!project) return null

  return {
    id: project.id,
    name: project.name,
    status: project.status ?? 'planning',
    progress: project.progress ?? 0,
  }
}

export function mapTeamDetail(team) {
  if (!team) return null

  const projects = (team.projects ?? team.activeProjects ?? [])
    .map(mapTeamProject)
    .filter(Boolean)

  return {
    ...mapTeam(team),
    members: (team.members ?? []).map(mapTeamMember).filter(Boolean),
    projects,
  }
}

export async function fetchTeams() {
  const response = await fetch('/api/teams', {
    credentials: 'include',
    headers: authHeaders(),
  })

  const data = await response.json().catch(() => ([]))

  if (!response.ok) {
    throw new ApiError(response.status, data.message || '팀 목록 조회에 실패했습니다.')
  }

  return (Array.isArray(data) ? data : []).map(mapTeam).filter(Boolean)
}

export async function fetchTeamDetail(teamId) {
  const response = await fetch(`/api/teams/${teamId}`, {
    credentials: 'include',
    headers: authHeaders(),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(response.status, data.message || '팀 정보 조회에 실패했습니다.')
  }

  return mapTeamDetail(data)
}

export async function createTeam({ name }) {
  const response = await fetch('/api/teams', {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: name?.trim() }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(response.status, data.message || '팀 생성에 실패했습니다.')
  }

  return mapTeam(data)
}

export async function deleteTeam(teamId) {
  const response = await fetch(`/api/teams/${teamId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: authHeaders(),
  })

  if (response.status === 204) {
    return
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(response.status, data.message || '팀 삭제에 실패했습니다.')
  }
}
