import { mapMember } from '../api/member'

const STORAGE_KEY = 'flowmate_project_members'

export function authUserToMember(auth, role = 'OWNER') {
  if (!auth?.id && !auth?.email) return null

  const name = auth.name ?? '나'
  return {
    id: auth.id ?? auth.email,
    userId: auth.id,
    name,
    nickname: name,
    email: auth.email ?? '',
    role,
    avatar: name.charAt(0),
  }
}

export function getLocalProjectMembers(projectId) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const all = JSON.parse(stored)
    return Array.isArray(all[projectId]) ? all[projectId].map(mapMember).filter(Boolean) : []
  } catch {
    return []
  }
}

export function addLocalProjectMember(projectId, member) {
  const stored = localStorage.getItem(STORAGE_KEY)
  const all = stored ? JSON.parse(stored) : {}
  const current = Array.isArray(all[projectId]) ? all[projectId] : []
  const email = member.email?.trim().toLowerCase()

  all[projectId] = [
    ...current.filter((item) => item.email?.trim().toLowerCase() !== email),
    member,
  ]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function getCurrentProjectMember(members, auth) {
  if (!auth || !Array.isArray(members)) return null

  return (
    members.find((member) => {
      const memberId = String(member.userId ?? member.id ?? '')
      const authId = String(auth.id ?? '')
      if (memberId && authId && memberId === authId) return true

      const memberEmail = member.email?.trim().toLowerCase()
      const authEmail = auth.email?.trim().toLowerCase()
      return Boolean(memberEmail && authEmail && memberEmail === authEmail)
    }) ?? null
  )
}

export function isProjectOwner(members, auth) {
  return getCurrentProjectMember(members, auth)?.role?.toUpperCase() === 'OWNER'
}

export function resolveProjectMembers(project, authUser, localMembers = []) {
  const apiMembers = (project?.members ?? []).map(mapMember).filter(Boolean)
  const seen = new Set()
  const merged = []

  const push = (member) => {
    if (!member) return
    const userKey = member.userId ?? member.id
    const emailKey = member.email?.trim().toLowerCase()
    const key = userKey ? `user:${userKey}` : emailKey ? `email:${emailKey}` : null
    if (!key || seen.has(key)) return
    seen.add(key)
    merged.push(member)
  }

  apiMembers.forEach(push)
  localMembers.forEach(push)

  if (merged.length === 0 && (project?.memberCount ?? 0) > 0) {
    const creator = authUserToMember(authUser)
    if (creator) push(creator)
  }

  return merged
}
