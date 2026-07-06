import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchProject, updateProject } from '../../api/project'
import Input from '../ui/Input'
import DueDateField from './DueDateField'
import ProjectProgressBar from './ProjectProgressBar'
import ProjectStatusBadge from './ProjectStatusBadge'
import { routePaths } from '../../constants/routes'
import { clearAuth } from '../../utils/auth'
import { getProjectColor, normalizeStatus } from '../../utils/dashboardFormat'

const STATUS_OPTIONS = [
  { value: 'planning', label: '기획' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'completed', label: '완료' },
  { value: 'on_hold', label: '보류' },
]

const EDIT_FORM_ID = 'project-edit-form'

function toDateInputValue(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}

export default function ProjectEditPageContent() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
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
            dueDate: toDateInputValue(data.dueDate ?? data.deadline),
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setErrors({ name: '프로젝트 이름을 입력해 주세요.' })
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await updateProject(projectId, form)
      navigate(routePaths.project(projectId))
    } catch (err) {
      if (err.status === 401) {
        clearAuth()
        navigate(routePaths.login(), { replace: true })
        return
      }
      setSubmitError(err.message || '프로젝트 수정에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const previewName = form.name.trim() || project.name
  const previewInitial = previewName.charAt(0).toUpperCase()

  return (
    <main className="flex flex-1 flex-col overflow-y-auto">      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 pt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Link to={routePaths.project(project.id)} className="text-sm text-slate-500 hover:text-slate-800">← 프로젝트로 돌아가기</Link>
            <div className="flex gap-2">
              <Link to={routePaths.project(project.id)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">취소</Link>
              <button type="submit" form={EDIT_FORM_ID} disabled={isSubmitting} className="rounded-lg bg-brand-600 px-3 py-2 text-sm text-white hover:bg-brand-700 disabled:opacity-50">
                {isSubmitting ? '저장 중...' : '저장'}
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
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">기본 정보</h2>
            <div className="mt-4 space-y-4">
              <Input label="프로젝트 이름" name="name" value={form.name} onChange={handleChange} error={errors.name} />
              <div className="space-y-1.5">
                <label htmlFor="edit-description" className="block text-sm font-medium text-slate-700">설명</label>
                <textarea id="edit-description" name="description" rows={4} value={form.description} onChange={handleChange} className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              </div>
              <Input label="팀 이름" name="teamName" value={form.teamName} onChange={handleChange} disabled />
              <div className="space-y-1.5">
                <label htmlFor="edit-status" className="block text-sm font-medium text-slate-700">상태</label>
                <select id="edit-status" name="status" value={form.status} onChange={handleChange} className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <DueDateField value={form.dueDate} onChange={handleChange} />
            </div>
          </section>
          {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        </form>
      </div></main>
  )
}
