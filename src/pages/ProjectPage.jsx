import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createProject, fetchProject } from '../api/project'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import DatePicker from '../components/ui/DatePicker'
import ProjectProgressBar from '../components/project/ProjectProgressBar'
import ProjectStatusBadge from '../components/project/ProjectStatusBadge'
import { routePaths } from '../constants/routes'
import { clearAuth } from '../utils/auth'
import { getProjectColor, normalizeStatus } from '../utils/dashboardFormat'

const STATUS_OPTIONS = [
  { value: 'planning', label: '기획' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'completed', label: '완료' },
  { value: 'on_hold', label: '보류' },
]

const CREATE_FORM_ID = 'project-create-form'
const EDIT_FORM_ID = 'project-edit-form'

export default function ProjectCreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    teamName: '',
    status: 'planning',
    dueDate: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setSubmitError('')
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) {
      nextErrors.name = '프로젝트 이름을 입력해 주세요.'
    }
    if (!form.teamName.trim()) {
      nextErrors.teamName = '팀 이름을 입력해 주세요.'
    }
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
      const project = await createProject(form)
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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Link to={routePaths.projects()} className="text-sm text-slate-500 hover:text-slate-800">← 프로젝트 목록</Link>
            <div className="flex w-full max-w-sm gap-2 sm:w-80">
              <Link to={routePaths.projects()} className="inline-flex flex-[1] basis-0 items-center justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">취소</Link>
              <button type="submit" form={CREATE_FORM_ID} disabled={isSubmitting} className="inline-flex flex-[9] basis-0 items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
                {isSubmitting ? '생성 중...' : '프로젝트 생성'}
              </button>
            </div>
          </div>
          <div className="mb-5 flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">{form.name.trim() ? form.name.trim().charAt(0).toUpperCase() : '+'}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{form.name.trim() || '새 프로젝트'}</h1>
                <ProjectStatusBadge status={form.status} size="md" />
              </div>
              <p className="mt-1 text-sm text-slate-500">{form.teamName.trim() || '팀 이름을 입력해 주세요'}</p>
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
              <Input label="팀 이름" name="teamName" value={form.teamName} onChange={handleChange} error={errors.teamName} />
              <div className="space-y-1.5">
                <label htmlFor="status" className="block text-sm font-medium text-slate-700">상태</label>
                <select id="status" name="status" value={form.status} onChange={handleChange} className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">마감일</label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="date-input"
                />
              </div>
            </div>
          </section>
          {submitError && <p className="text-sm text-red-600">{submitError}</p>}
          <div className="flex gap-3">
            <Link to={routePaths.projects()} className="inline-flex flex-[1] basis-0 items-center justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">취소</Link>
            <Button type="submit" className="flex-[9] basis-0 !w-auto justify-center px-6" disabled={isSubmitting}>
              {isSubmitting ? '생성 중...' : '프로젝트 생성'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}

export function ProjectEditPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    description: '',
    teamName: '',
    status: 'planning',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProject() {
      setLoading(true)
      try {
        const data = await fetchProject(projectId)
        if (!cancelled) {
          setProject(data)
          setForm({
            name: data.name ?? '',
            description: data.description ?? '',
            teamName: data.teamName ?? '',
            status: normalizeStatus(data.status) || 'planning',
          })
        }
      } catch (err) {
        if (cancelled) return
        if (err.status === 401) {
          clearAuth()
          navigate(routePaths.login(), { replace: true })
          return
        }
        setProject(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProject()
    return () => { cancelled = true }
  }, [projectId, navigate])

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-slate-500">프로젝트를 불러오는 중...</p>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-slate-500">프로젝트를 찾을 수 없습니다.</p>
      </main>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setSubmitError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setErrors({ name: '프로젝트 이름을 입력해 주세요.' })
      return
    }
    setSubmitError('프로젝트 수정 API는 아직 준비 중입니다.')
  }

  const previewName = form.name.trim() || project.name
  const previewInitial = previewName.charAt(0).toUpperCase()

  return (
    <main className="flex flex-1 flex-col overflow-y-auto">
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 pt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Link to={routePaths.project(project.id)} className="text-sm text-slate-500 hover:text-slate-800">
              ← 프로젝트로 돌아가기
            </Link>
            <div className="flex gap-2">
              <Link to={routePaths.project(project.id)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                취소
              </Link>
              <button type="submit" form={EDIT_FORM_ID} className="rounded-lg bg-brand-600 px-3 py-2 text-sm text-white hover:bg-brand-700">
                저장
              </button>
            </div>
          </div>
          <div className="mb-5 flex items-start gap-4">
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white ${getProjectColor(project.id)}`}>
              {previewInitial}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{previewName}</h1>
                <ProjectStatusBadge status={form.status} size="md" />
              </div>
              <p className="mt-1 text-sm text-slate-500">{form.teamName.trim() || project.teamName || '팀 이름'}</p>
            </div>
          </div>
          <div className="mb-5 max-w-md"><ProjectProgressBar progress={project.progress} size="sm" /></div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <form id={EDIT_FORM_ID} onSubmit={handleSubmit} className="space-y-6" noValidate>
          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mt-4 space-y-4">
              <Input label="프로젝트 이름" name="name" value={form.name} onChange={handleChange} error={errors.name} />
              <div className="space-y-1.5">
                <label htmlFor="edit-description" className="block text-sm font-medium text-slate-700">설명</label>
                <textarea id="edit-description" name="description" rows={4} value={form.description} onChange={handleChange} className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              </div>
              <Input label="팀 이름" name="teamName" value={form.teamName} onChange={handleChange} disabled />
            </div>
          </section>
          {submitError && <p className="text-sm text-amber-600">{submitError}</p>}
        </form>
      </div>
    </main>
  )
}
