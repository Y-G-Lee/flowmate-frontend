import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TeamMemberInviteModal from '../components/team/TeamMemberInviteModal'
import TeamMemberList from '../components/team/TeamMemberList'
import TeamProjectList from '../components/team/TeamProjectList'
import { deleteTeam, fetchTeamDetail, inviteTeamMember } from '../api/team'
import { getMockTeamDetail } from '../data/mockTeamDetails'
import { routePaths } from '../constants/routes'
import { clearAuth, getAuth } from '../utils/auth'
import { getTeamColor } from '../utils/teamFormat'

function StatPill({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-center shadow-sm">
      <p className="text-lg font-semibold tabular-nums text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}

export default function TeamDetailPage() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isInviting, setIsInviting] = useState(false)

  const auth = getAuth()
  const isOwner = useMemo(() => {
    if (!team?.members?.length || !auth?.id) return false
    return team.members.some(
      (member) =>
        String(member.userId) === String(auth.id) &&
        member.teamRole?.toUpperCase() === 'OWNER',
    )
  }, [team, auth?.id])

  const loadTeamDetail = useCallback(async () => {
    setError('')
    const data = await fetchTeamDetail(teamId)
    setTeam(data)
    return data
  }, [teamId])

  useEffect(() => {
    let cancelled = false

    async function init() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchTeamDetail(teamId)
        if (!cancelled) {
          setTeam(data)
        }
      } catch (err) {
        if (!cancelled) {
          if (err.status === 401) {
            clearAuth()
            navigate(routePaths.login(), { replace: true })
            return
          }
          const mock = getMockTeamDetail(teamId)
          if (mock) {
            setTeam({
              ...mock,
              members: mock.members ?? [],
              projects: mock.projects ?? [],
            })
          } else if (err.status === 404) {
            setTeam(null)
          } else {
            setError(err.message || '팀 정보를 불러오지 못했습니다.')
          }
        }
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
  }, [teamId, navigate])

  const handleInviteMember = async ({ userId }) => {
    setIsInviting(true)
    try {
      await inviteTeamMember(teamId, { userId })
      setModalOpen(false)
      await loadTeamDetail()
    } finally {
      setIsInviting(false)
    }
  }

  const handleDelete = async () => {
    if (
      !window.confirm(
        `"${team.name}" 팀을 삭제하시겠습니까?\n팀에 속한 프로젝트와 작업도 함께 삭제됩니다.`,
      )
    ) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteTeam(teamId)
      navigate(routePaths.team())
    } catch (err) {
      if (err.status === 401) {
        clearAuth()
        navigate(routePaths.login(), { replace: true })
        return
      }
      window.alert(err.message || '팀 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center bg-slate-50/60 p-6">
        <p className="text-sm text-slate-500">팀 정보를 불러오는 중...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center bg-slate-50/60 p-6">
        <p className="text-sm text-red-600">{error}</p>
      </main>
    )
  }

  if (!team) {
    return (
      <main className="flex flex-1 items-center justify-center bg-slate-50/60 p-6">
        <p className="text-sm text-slate-500">팀을 찾을 수 없습니다.</p>
      </main>
    )
  }

  const memberCount = team.memberCount ?? team.members?.length ?? 0
  const projectCount = team.projectCount ?? team.projects?.length ?? 0

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50/60">
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to={routePaths.team()}
              className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-800"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              팀 목록
            </Link>
            {isOwner && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '팀 삭제'}
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm ${getTeamColor(team.id)}`}
              >
                {team.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">워크스페이스</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{team.name}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                  {team.description?.trim() || '팀 설명이 없습니다.'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <StatPill label="멤버" value={`${memberCount}명`} />
              <StatPill label="프로젝트" value={`${projectCount}개`} />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-5">
          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">프로젝트</h2>
                <p className="mt-0.5 text-sm text-slate-500">이 팀에서 진행 중인 모든 프로젝트</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {projectCount}개
              </span>
            </div>
            <div className="mt-5">
              <TeamProjectList projects={team.projects} />
            </div>
          </section>

          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">멤버</h2>
                <p className="mt-0.5 text-sm text-slate-500">팀에 참여 중인 사람</p>
              </div>
              <div className="flex items-center gap-2">
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    + 멤버 추가
                  </button>
                )}
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {memberCount}명
                </span>
              </div>
            </div>
            <div className="mt-5">
              <TeamMemberList members={team.members} />
            </div>
          </section>
        </div>
      </div>

      <TeamMemberInviteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleInviteMember}
        isSubmitting={isInviting}
        existingUserIds={team.members?.map((member) => member.userId).filter(Boolean) ?? []}
      />
    </main>
  )
}
