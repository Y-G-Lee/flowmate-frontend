export const KANBAN_COLUMNS = [
  { key: 'todo', label: '할 일', status: 'todo' },
  { key: 'in_progress', label: '진행 중', status: 'in_progress' },
  { key: 'done', label: '완료', status: 'done' },
]

export function normalizeTaskStatus(status) {
  return (status ?? 'todo').toLowerCase().replace(/-/g, '_')
}

export function getKanbanColumnKey(status) {
  const normalized = normalizeTaskStatus(status)
  if (normalized === 'done') return 'done'
  if (normalized === 'in_progress' || normalized === 'review') return 'in_progress'
  return 'todo'
}

export const PRIORITY_CONFIG = {
  High: { label: '높음', dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 ring-red-100' },
  Medium: { label: '보통', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 ring-amber-100' },
  Low: { label: '낮음', dot: 'bg-slate-300', badge: 'bg-slate-50 text-slate-600 ring-slate-100' },
}

export function getPriorityConfig(priority) {
  return PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.Medium
}

export function formatPriorityLabel(priority) {
  return getPriorityConfig(priority).label
}

export function isOverdue(dueDate) {
  if (!dueDate) return false
  const date = new Date(dueDate)
  if (Number.isNaN(date.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}
