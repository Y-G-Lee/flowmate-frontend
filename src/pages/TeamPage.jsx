import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TeamCard from '../components/team/TeamCard'
import TeamCreateModal from '../components/team/TeamCreateModal'
import TeamPageSkeleton from '../components/team/TeamPageSkeleton'
import Button from '../components/ui/Button'
import { createTeam, fetchTeams } from '../api/team'
import { MOCK_TEAMS } from '../data/mockTeams'
import { routePaths } from '../constants/routes'
import { clearAuth } from '../utils/auth'

export default function TeamPage() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadTeams = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTeams()
      setTeams(data)
    } catch (err) {
      if (err.status === 401) {
        clearAuth()
        navigate(routePaths.login(), { replace: true })
        return
      }
      setTeams(MOCK_TEAMS)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  const handleCreateTeam = async ({ name }) => {
    setIsSubmitting(true)
    try {
      const team = await createTeam({ name })
      setModalOpen(false)
      await loadTeams()
      navigate(routePaths.teamDetail(team.id))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50/60">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">팀</h1>
            <p className="mt-2 text-sm text-slate-500">
              {loading
                ? '팀 목록을 불러오는 중입니다.'
                : `${teams.length}개 워크스페이스 · 멤버와 프로젝트를 함께 관리하세요`}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            className="!w-auto shrink-0 px-4 shadow-sm"
          >
            + 팀 만들기
          </Button>
        </div>

        {loading ? (
          <TeamPageSkeleton />
        ) : teams.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.09 9.09 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <h2 className="mt-4 text-base font-semibold text-slate-900">아직 참여 중인 팀이 없습니다</h2>
            <p className="mt-1 text-sm text-slate-500">새 팀을 만들어 프로젝트 협업을 시작해 보세요.</p>
            <Button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mx-auto mt-5 !w-auto px-5"
            >
              + 팀 만들기
            </Button>
          </div>
        )}
      </div>

      <TeamCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTeam}
        isSubmitting={isSubmitting}
      />
    </main>
  )
}
