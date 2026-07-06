const TEAM_COLORS = [
  'bg-violet-500',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-indigo-500',
]

export function getTeamColor(id) {
  const numericId = Number(id) || 0
  return TEAM_COLORS[numericId % TEAM_COLORS.length]
}

export function getInitials(name, fallback = '?') {
  const trimmed = name?.trim()
  if (!trimmed) return fallback

  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
  }

  return trimmed.slice(0, 2).toUpperCase()
}

export function formatTeamRole(role) {
  return role?.toUpperCase() === 'OWNER' ? '팀장' : '팀원'
}
