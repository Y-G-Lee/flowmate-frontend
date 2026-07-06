import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function TeamCreateModal({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!open) return
    setName('')
    setError('')
    setSubmitError('')
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('팀 이름을 입력해 주세요.')
      return
    }
    setError('')
    setSubmitError('')
    try {
      await onSubmit?.({ name: trimmed })
    } catch (err) {
      setSubmitError(err.message || '팀 생성에 실패했습니다.')
    }
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="team-create-title">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 id="team-create-title" className="text-lg font-semibold text-slate-900">
            새 팀 만들기
          </h3>
          <p className="mt-1 text-sm text-slate-500">워크스페이스 이름을 입력해 주세요.</p>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            <Input
              label="팀 이름"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
                setSubmitError('')
              }}
              error={error}
              placeholder="예: Product Team"
              autoFocus
            />
            {submitError && <p className="text-sm text-red-600">{submitError}</p>}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex flex-[1] basis-0 items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                취소
              </button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-[9] basis-0 !w-auto justify-center px-6"
              >
                {isSubmitting ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  )
}
