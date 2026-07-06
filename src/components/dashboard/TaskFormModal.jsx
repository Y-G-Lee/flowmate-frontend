import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Input from '../ui/Input'
import Button from '../ui/Button'
import DueDateField from '../project/DueDateField'

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const PRIORITY_OPTIONS = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
]

const EMPTY_FORM = {
  projectId: '',
  title: '',
  status: 'todo',
  priority: 'Medium',
  dueDate: '',
}

const EMPTY_PROJECTS = []

export default function TaskFormModal({
  open,
  onClose,
  onSubmit,
  projects = EMPTY_PROJECTS,
  fixedProjectId,
  defaultStatus = 'todo',
  isSubmitting = false,
  submitLabel,
  mode = 'create',
  initialValues = null,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const isEdit = mode === 'edit'
  const resolvedSubmitLabel = submitLabel ?? (isEdit ? '저장' : '추가')

  useEffect(() => {
    if (!open) return
    if (isEdit && initialValues) {
      setForm({
        projectId: String(initialValues.projectId ?? fixedProjectId ?? ''),
        title: initialValues.title ?? '',
        status: (initialValues.status ?? 'todo').toLowerCase().replace(/-/g, '_'),
        priority: initialValues.priority ?? 'Medium',
        dueDate: String(initialValues.dueDate ?? initialValues.deadline ?? '').slice(0, 10),
      })
    } else {
      setForm({
        ...EMPTY_FORM,
        projectId: fixedProjectId ? String(fixedProjectId) : String(projects[0]?.id ?? ''),
        status: defaultStatus,
      })
    }
    setErrors({})
  }, [open, isEdit, fixedProjectId, defaultStatus, projects[0]?.id, initialValues?.id])

  if (!open) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    const projectId = fixedProjectId ?? form.projectId
    if (!projectId) nextErrors.projectId = '프로젝트를 선택해 주세요.'
    if (!form.title.trim()) nextErrors.title = '작업 제목을 입력해 주세요.'
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    onSubmit?.({ ...form, projectId: String(projectId) })
  }

  const showProjectSelect = projects.length > 0 && (!fixedProjectId || isEdit)

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 id="task-form-title" className="text-lg font-semibold text-slate-900">{isEdit ? '작업 수정' : '작업 추가'}</h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            {showProjectSelect && (
              <div className="space-y-1.5">
                <label htmlFor="task-project" className="block text-sm font-medium text-slate-700">
                  프로젝트
                </label>
                <select
                  id="task-project"
                  name="projectId"
                  value={form.projectId}
                  onChange={handleChange}
                  disabled={isEdit}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="">선택</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.projectId && <p className="text-sm text-red-600">{errors.projectId}</p>}
              </div>
            )}
            <Input label="작업 제목" name="title" value={form.title} onChange={handleChange} error={errors.title} autoFocus />
            <div className="space-y-1.5">
              <label htmlFor="task-status" className="block text-sm font-medium text-slate-700">상태</label>
              <select
                id="task-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="task-priority" className="block text-sm font-medium text-slate-700">우선순위</label>
              <select
                id="task-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <DueDateField value={form.dueDate} onChange={handleChange} />
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex flex-[1] basis-0 items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                취소
              </button>
              <Button type="submit" disabled={isSubmitting} className="flex-[9] basis-0 !w-auto justify-center px-6">
                {isSubmitting ? (isEdit ? '저장 중...' : '추가 중...') : resolvedSubmitLabel}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  )
}
