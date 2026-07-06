import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchProjectMembers, inviteProjectMember, removeProjectMember } from '../api/member'
import { fetchProject } from '../api/project'
import { createTask, fetchProjectTasks, updateTask } from '../api/task'
import ProjectActivityTab from '../components/project/ProjectActivityTab'
import ProjectBoardTab from '../components/project/ProjectBoardTab'
import ProjectDetailHeader from '../components/project/ProjectDetailHeader'
import ProjectMembersTab from '../components/project/ProjectMembersTab'
import ProjectOverviewTab from '../components/project/ProjectOverviewTab'
import ProjectSettingsTab from '../components/project/ProjectSettingsTab'
import { routePaths } from '../constants/routes'
import { clearAuth } from '../utils/auth'

function resolveActiveTab(pathname, projectId) {
  const base = `/projects/${projectId}`
  if (pathname.includes('/members')) return 'members'
  if (pathname.includes('/activity')) return 'activity'
  if (pathname.includes('/settings')) return 'settings'
  if (pathname === `${base}/board` || pathname === `${base}/kanban`) return 'board'
  return 'overview'
}

export default function KanbanPage() {
  const { projectId } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [removeError, setRemoveError] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const activeTab = useMemo(
    () => resolveActiveTab(pathname, projectId),
    [pathname, projectId],
  )

  const loadMembers = useCallback(async () => {
    const apiMembers = await fetchProjectMembers(projectId)
    setMembers(apiMembers)
  }, [projectId])

  const loadProject = useCallback(async () => {
    const [data, tasks] = await Promise.all([
      fetchProject(projectId),
      fetchProjectTasks(projectId),
    ])
    setProject({ ...data, tasks })
    await loadMembers()
  }, [projectId, loadMembers])

  useEffect(() => {
    let cancelled = false

    async function init() {
      setLoading(true)
      setError('')

      try {
        await loadProject()
      } catch (err) {
        if (cancelled) return

        if (err.status === 401) {
          clearAuth()
          navigate(routePaths.login(), { replace: true })
          return
        }

        setError(err.message || '프로젝트를 불러오지 못했습니다.')
        setProject(null)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [projectId, navigate, loadProject])

  const handleInviteMember = async (form) => {
    setIsInviting(true)
    setInviteError('')

    try {
      await inviteProjectMember(project.id, form)
      await loadMembers()
    } catch (err) {
      setInviteError(err.message || '멤버 추가에 실패했습니다.')
      throw err
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveMembers = async (membersToRemove) => {
    if (membersToRemove.length === 0) return

    const label =
      membersToRemove.length === 1
        ? `"${membersToRemove[0].name ?? membersToRemove[0].nickname ?? '멤버'}"`
        : `선택한 ${membersToRemove.length}명`

    if (!window.confirm(`${label} 멤버를 프로젝트에서 제거하시겠습니까?`)) return

    setIsRemoving(true)
    setRemoveError('')

    try {
      for (const member of membersToRemove) {
        const userId = member.userId ?? member.id
        await removeProjectMember(project.id, userId)
      }
      await loadMembers()
    } catch (err) {
      setRemoveError(err.message || '멤버 삭제에 실패했습니다.')
      throw err
    } finally {
      setIsRemoving(false)
    }
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center bg-slate-50/60 p-6">
        <p className="text-sm text-slate-500">프로젝트를 불러오는 중...</p>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="flex flex-1 items-center justify-center bg-slate-50/60 p-6">
        <p className="text-sm text-slate-500">{error || '프로젝트를 찾을 수 없습니다.'}</p>
      </main>
    )
  }

  const projectWithMembers = { ...project, members }

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-slate-50/60">
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-5 pt-4">
          <ProjectDetailHeader project={projectWithMembers} />
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl flex-1 px-5 py-4">
        {activeTab === 'overview' && <ProjectOverviewTab project={projectWithMembers} />}
        {activeTab === 'board' && (
          <ProjectBoardTab
            project={project}
            onCreateTask={async (form) => {
              await createTask(project.id, form)
              await loadProject()
            }}
            onUpdateTask={async (taskId, updates) => {
              const updated = await updateTask(project.id, taskId, updates)
              await loadProject()
              return updated
            }}
          />
        )}
        {activeTab === 'members' && (
          <ProjectMembersTab
            members={members}
            onInviteMember={handleInviteMember}
            onRemoveMembers={handleRemoveMembers}
            isSubmitting={isInviting}
            isRemoving={isRemoving}
            inviteError={inviteError}
            removeError={removeError}
          />
        )}
        {activeTab === 'activity' && <ProjectActivityTab project={project} />}
        {activeTab === 'settings' && <ProjectSettingsTab project={project} />}
      </div>
    </main>
  )
}
