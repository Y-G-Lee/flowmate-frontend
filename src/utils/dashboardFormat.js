const PROJECT_COLORS = [
  'bg-violet-500',
  'bg-sky-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-indigo-500',
]

export function getProjectColor(id) {
  const numericId = Number(id) || 0
  return PROJECT_COLORS[numericId % PROJECT_COLORS.length]
}

export function normalizeStatus(status) {
  return (status ?? 'todo').toLowerCase().replace(/-/g, '_')
}

export function formatDateTime(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatRelativeTime(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`

  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export function formatDueDate(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  })
}

export function formatProjectStatus(status) {
  const normalized = normalizeStatus(status)

  const labels = {
    in_progress: '진행 중',
    completed: '완료',
    planning: '기획',
    on_hold: '보류',
    todo: '할 일',
    done: '완료',
  }

  return labels[normalized] ?? status ?? '-'
}
