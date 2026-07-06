import { MOCK_PROJECTS } from './mockProjects'

const STORAGE_KEY = 'flowmate_projects'

function loadProjects() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore
  }
  return structuredClone(MOCK_PROJECTS)
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function getAllProjects() {
  return loadProjects()
}

export function getProjectById(id) {
  return loadProjects().find((p) => String(p.id) === String(id)) ?? null
}

export function createProject({ name, description, status, teamName, dueDate }) {
  const projects = loadProjects()
  const nextId = String(
    Math.max(0, ...projects.map((p) => Number(p.id) || 0)) + 1,
  )

  const project = {
    id: nextId,
    name: name.trim(),
    description: description.trim(),
    status: status || 'planning',
    progress: 0,
    teamName: teamName.trim() || 'My Team',
    taskCount: 0,
    completedTaskCount: 0,
    memberCount: 1,
    startDate: new Date().toISOString().slice(0, 10),
    dueDate: dueDate || null,
    updatedAt: new Date().toISOString(),
    members: [],
    tasks: [],
  }

  projects.unshift(project)
  saveProjects(projects)
  return project
}

export function updateProject(id, updates) {
  const projects = loadProjects()
  const index = projects.findIndex((p) => String(p.id) === String(id))
  if (index === -1) return null

  const current = projects[index]
  const updated = {
    ...current,
    name: updates.name?.trim() ?? current.name,
    description: updates.description?.trim() ?? current.description,
    status: updates.status ?? current.status,
    teamName: updates.teamName?.trim() || current.teamName,
    dueDate: updates.dueDate !== undefined ? updates.dueDate || null : current.dueDate,
    updatedAt: new Date().toISOString(),
  }

  projects[index] = updated
  saveProjects(projects)
  return updated
}

export function deleteProject(id) {
  const projects = loadProjects()
  const filtered = projects.filter((p) => String(p.id) !== String(id))
  if (filtered.length === projects.length) return false

  saveProjects(filtered)
  return true
}

function normalizeTaskStatus(status) {
  return (status ?? 'todo').toLowerCase().replace(/-/g, '_')
}

function recalcProjectTaskStats(tasks) {
  const completedTaskCount = tasks.filter(
    (t) => normalizeTaskStatus(t.status) === 'done',
  ).length
  return {
    tasks,
    taskCount: tasks.length,
    completedTaskCount,
    progress: tasks.length ? Math.round((completedTaskCount / tasks.length) * 100) : 0,
  }
}

function generateTaskKey(project) {
  const existing = project.tasks ?? []
  const fromKey = existing.find((t) => t.key)?.key?.split('-')[0]
  const prefix =
    fromKey ||
    project.name.slice(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '') ||
    'TSK'
  const nums = existing.map((t) => {
    const match = t.key?.match(/-(\d+)$/)
    return match ? Number(match[1]) : 0
  })
  const next = Math.max(0, ...nums, 0) + 1
  return `${prefix}-${next}`
}

function findProjectIndex(projects, projectId) {
  return projects.findIndex((p) => String(p.id) === String(projectId))
}

export function createTask(projectId, { title, status, assignee, priority, dueDate }) {
  const projects = loadProjects()
  const index = findProjectIndex(projects, projectId)
  if (index === -1) return null

  const project = projects[index]
  const tasks = [...(project.tasks ?? [])]
  const task = {
    id: `t${Date.now()}`,
    key: generateTaskKey(project),
    title: title.trim(),
    status: status || 'todo',
    assignee: assignee?.trim() || '',
    priority: priority || 'Medium',
    dueDate: dueDate || null,
    updatedAt: new Date().toISOString(),
  }

  tasks.unshift(task)
  projects[index] = {
    ...project,
    ...recalcProjectTaskStats(tasks),
    updatedAt: new Date().toISOString(),
  }
  saveProjects(projects)
  return task
}

export function updateTask(projectId, taskId, updates) {
  const projects = loadProjects()
  const index = findProjectIndex(projects, projectId)
  if (index === -1) return null

  const project = projects[index]
  const tasks = [...(project.tasks ?? [])]
  const taskIndex = tasks.findIndex((t) => String(t.id) === String(taskId))
  if (taskIndex === -1) return null

  const current = tasks[taskIndex]
  const updated = {
    ...current,
    title: updates.title?.trim() ?? current.title,
    status: updates.status ?? current.status,
    assignee: updates.assignee !== undefined ? updates.assignee.trim() : current.assignee,
    priority: updates.priority ?? current.priority,
    dueDate: updates.dueDate !== undefined ? updates.dueDate || null : current.dueDate,
    updatedAt: new Date().toISOString(),
  }

  tasks[taskIndex] = updated
  projects[index] = {
    ...project,
    ...recalcProjectTaskStats(tasks),
    updatedAt: new Date().toISOString(),
  }
  saveProjects(projects)
  return updated
}

export function deleteTask(projectId, taskId) {
  const projects = loadProjects()
  const index = findProjectIndex(projects, projectId)
  if (index === -1) return false

  const project = projects[index]
  const tasks = (project.tasks ?? []).filter((t) => String(t.id) !== String(taskId))
  if (tasks.length === (project.tasks ?? []).length) return false

  projects[index] = {
    ...project,
    ...recalcProjectTaskStats(tasks),
    updatedAt: new Date().toISOString(),
  }
  saveProjects(projects)
  return true
}

export function getRecentTasks(limit = 10) {
  const all = getAllTasks()
  return limit ? all.slice(0, limit) : all
}

export function getAllTasks() {
  const projects = loadProjects()
  const flat = []

  for (const project of projects) {
    for (const task of project.tasks ?? []) {
      flat.push({
        id: task.id,
        key: task.key,
        title: task.title,
        status: task.status,
        assigneeName: task.assignee ?? task.assigneeName ?? '',
        priority: task.priority,
        dueDate: task.dueDate,
        projectId: project.id,
        projectName: project.name,
        updatedAt: task.updatedAt ?? project.updatedAt,
      })
    }
  }

  flat.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  return flat
}
