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

export function mapProject(project) {
  if (!project) return null

  return {
    ...project,
    dueDate: project.deadline ?? project.dueDate ?? null,
    updatedAt: project.updatedAt ?? project.createdAt,
    startDate: project.createdAt,
    members: project.members ?? [],
    tasks: project.tasks ?? [],
  }
}

export async function fetchProjects() {
  const data = await request('/api/projects', {}, '프로젝트 목록 조회에 실패했습니다.')
  return data.map(mapProject)
}

export async function fetchProject(projectId) {
  const data = await request(
    `/api/projects/${projectId}`,
    {},
    '프로젝트 조회에 실패했습니다.',
  )
  return mapProject(data)
}

export async function updateProject(projectId, { name, description, status, deadline, dueDate }) {
  const resolvedDeadline = deadline ?? dueDate ?? null

  const data = await request(
    `/api/projects/${projectId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name?.trim(),
        description: description?.trim() || null,
        status: status || 'planning',
        deadline: resolvedDeadline || null,
      }),
    },
    '프로젝트 수정에 실패했습니다.',
  )
  return mapProject(data)
}

export async function deleteProject(projectId) {
  await request(
    `/api/projects/${projectId}`,
    { method: 'DELETE' },
    '프로젝트 삭제에 실패했습니다.',
  )
}

export async function createProject({ name, description, status, teamName, teamId, deadline, dueDate }) {
  const resolvedDeadline = deadline ?? dueDate ?? null

  const data = await request(
    '/api/projects',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name?.trim(),
        description: description?.trim() || null,
        status: status || 'planning',
        teamName: teamName?.trim() || null,
        teamId: teamId ?? null,
        deadline: resolvedDeadline || null,
      }),
    },
    '프로젝트 생성에 실패했습니다.',
  )
  return mapProject(data)
}
