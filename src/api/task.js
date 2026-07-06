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

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(response.status, data.message || errorMessage)
  }

  return data
}

function normalizeStatus(status) {
  return (status ?? 'TODO').toLowerCase().replace(/-/g, '_')
}

function normalizePriority(priority) {
  if (!priority) return 'Medium'
  const value = priority.toLowerCase()
  if (value === 'high') return 'High'
  if (value === 'low') return 'Low'
  return 'Medium'
}

export function mapTask(task) {
  if (!task) return null

  return {
    id: task.id,
    key: `T-${task.id}`,
    title: task.title,
    description: task.description,
    status: normalizeStatus(task.status),
    priority: normalizePriority(task.priority),
    assignee: task.assigneeName ?? '',
    assigneeName: task.assigneeName ?? '',
    dueDate: task.deadline ?? task.dueDate,
    projectId: task.projectId,
    projectName: task.projectName,
    updatedAt: task.createdAt,
  }
}

export function mapRecentTask(task, projects = []) {
  if (!task) return null

  const projectName = projects.find((p) => String(p.id) === String(task.projectId))?.name ?? ''

  return {
    id: task.id,
    key: `T-${task.id}`,
    title: task.title,
    status: normalizeStatus(task.status),
    priority: normalizePriority(task.priority),
    assignee: task.assigneeName ?? '',
    assigneeName: task.assigneeName ?? '',
    dueDate: task.deadline ?? task.dueDate,
    projectId: task.projectId,
    projectName,
  }
}

export async function fetchProjectTasks(projectId) {
  const data = await request(
    `/api/projects/${projectId}/tasks`,
    {},
    '프로젝트 작업 조회에 실패했습니다.',
  )
  return data.map(mapTask)
}

export async function createTask(projectId, { title, description, status, priority, deadline, dueDate }) {
  const resolvedDeadline = deadline ?? dueDate ?? null

  const data = await request(
    `/api/projects/${projectId}/tasks`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title?.trim(),
        description: description?.trim() || null,
        status: status || 'todo',
        priority: priority || 'Medium',
        deadline: resolvedDeadline || null,
      }),
    },
    '작업 생성에 실패했습니다.',
  )
  return mapTask(data)
}

export async function updateTask(projectId, taskId, { title, description, status, priority, deadline, dueDate }) {
  const resolvedDeadline = deadline ?? dueDate

  const data = await request(
    `/api/projects/${projectId}/tasks/${taskId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title?.trim(),
        description: description?.trim() || null,
        status: status ?? undefined,
        priority: priority ?? undefined,
        deadline: resolvedDeadline !== undefined ? resolvedDeadline || null : undefined,
      }),
    },
    '작업 수정에 실패했습니다.',
  )
  return mapTask(data)
}

export async function deleteTask(projectId, taskId) {
  await request(
    `/api/projects/${projectId}/tasks/${taskId}`,
    { method: 'DELETE' },
    '작업 삭제에 실패했습니다.',
  )
}

export async function fetchAllProjectTasks(projects = []) {
  if (!projects.length) return []

  const taskGroups = await Promise.all(
    projects.map((project) => fetchProjectTasks(project.id)),
  )

  return taskGroups.flat()
}
