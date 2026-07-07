import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createProject } from '../../api/project'
import { fetchTeams } from '../../api/team'
import Input from '../ui/Input'
import Button from '../ui/Button'
import DueDateField from './DueDateField'
import ProjectProgressBar from './ProjectProgressBar'
import ProjectStatusBadge from './ProjectStatusBadge'
import { routePaths } from '../../constants/routes'
import { clearAuth } from '../../utils/auth'

const STATUS_OPTIONS = [
  { value: 'planning', label: '기획' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'completed', label: '완료' },
  { value: 'on_hold', label: '보류' },
]

const CREATE_FORM_ID = 'project-create-form'

export default function ProjectCreatePageContent() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [teamsLoading, setTeamsLoading] = useState(true)
  const [teamsError, setTeamsError] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    teamId: '',
    status: 'planning',
    dueDate: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadTeams() {
      setTeamsLoading(true)
      setTeamsError('')
      try {
        const data = await fetchTeams()
        if (!cancelled) {
          setTeams(data)
        }
      } catch (err) {
        if (!cancelled) {
          if (err.status === 401) {
            clearAuth()
            navigate(routePaths.login(), { replace: true })
            return
          }
          setTeamsError(err.message || '팀 목록을 불러오지 못했습니다.')
        }
      } finally {
        if (!cancelled) {
          setTeamsLoading(false)
        }
      }
    }

    loadTeams()
    return () => {
      cancelled = true
    }
  }, [navigate])

  const selectedTeam = teams.find((team) => String(team.id) === String(form.teamId))

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setSubmitError('')
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = '프로젝트 이름을 입력해 주세요.'
    if (!form.teamId) nextErrors.teamId = '팀을 선택해 주세요.'
    return nextErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const project = await createProject({
        ...form,
        teamId: Number(form.teamId),
      })
      navigate(routePaths.project(project.id))
    } catch (err) {
      if (err.status === 401) {
        clearAuth()
        navigate(routePaths.login(), { replace: true })
        return
      }
      setSubmitError(err.message || '프로젝트 생성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex flex-1 flex-col overflow-y-auto">
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 pt-6">
          <div className="mb-4">
            <Link to={routePaths.projects()} className="text-sm text-slate-500 hover:text-slate-800">← 프로젝트 목록</Link>
          </div>
          <div className="mb-5 flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">{form.name.trim() ? form.name.trim().charAt(0).toUpperCase() : '+'}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{form.name.trim() || '새 프로젝트'}</h1>
                <ProjectStatusBadge status={form.status} size="md" />
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {selectedTeam?.name || (teamsLoading ? '팀 목록 불러오는 중...' : '팀을 선택해 주세요')}
              </p>
            </div>
          </div>
          <div className="mb-5 max-w-md"><ProjectProgressBar progress={0} size="sm" /></div>
          <nav className="flex gap-6 border-b border-slate-200/80">
            <span className="tab-link active">개요</span>
            <span className="pb-3 text-sm text-slate-300">보드</span>
            <span className="pb-3 text-sm text-slate-300">멤버</span>
          </nav>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <form id={CREATE_FORM_ID} onSubmit={handleSubmit} className="space-y-6" noValidate>
          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">기본 정보</h2>
            <div className="mt-4 space-y-4">
              <Input label="프로젝트 이름" name="name" value={form.name} onChange={handleChange} error={errors.name} />
              <div className="space-y-1.5">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">설명</label>
                <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange} className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="teamId" className="block text-sm font-medium text-slate-700">팀</label>
                <select
                  id="teamId"
                  name="teamId"
                  value={form.teamId}
                  onChange={handleChange}
                  disabled={teamsLoading || teams.length === 0}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">
                    {teamsLoading ? '팀 목록 불러오는 중...' : '팀을 선택해 주세요'}
                  </option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {errors.teamId && <p className="text-sm text-red-600">{errors.teamId}</p>}
                {teamsError && <p className="text-sm text-red-600">{teamsError}</p>}
                {!teamsLoading && !teamsError && teams.length === 0 && (
                  <p className="text-sm text-slate-500">
                    참여 중인 팀이 없습니다.{' '}
                    <Link to={routePaths.team()} className="text-brand-600 hover:underline">
                      팀 메뉴
                    </Link>
                    에서 팀을 확인해 주세요.
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="status" className="block text-sm font-medium text-slate-700">상태</label>
                <select id="status" name="status" value={form.status} onChange={handleChange} className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <DueDateField value={form.dueDate} onChange={handleChange} />
            </div>
          </section>
          {submitError && <p className="text-sm text-red-600">{submitError}</p>}
          <div className="flex gap-3">
            <Link to={routePaths.projects()} className="inline-flex flex-[1] basis-0 items-center justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">취소</Link>
            <Button type="submit" className="flex-[9] basis-0 !w-auto justify-center px-6" disabled={isSubmitting || teamsLoading || teams.length === 0}>
              {isSubmitting ? '생성 중...' : '프로젝트 생성'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
