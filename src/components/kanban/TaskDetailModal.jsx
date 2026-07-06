import { useState } from 'react'
import { createPortal } from 'react-dom'
import StatusBadge from '../dashboard/StatusBadge'
import { formatDateTime, formatDueDate } from '../../utils/dashboardFormat'
import { getPriorityConfig, KANBAN_COLUMNS, normalizeTaskStatus } from '../../utils/taskFormat'

export default function TaskDetailModal({
  open,
  task,
  projectName,
  onClose,
  onStatusChange,
  isUpdating = false,
}) {
  const [error, setError] = useState('')

  if (!open || !task) return null

  const priority = getPriorityConfig(task.priority)
  const currentStatus = normalizeTaskStatus(task.status)

  const handleStatusChange = async (nextStatus) => {
    if (nextStatus === currentStatus || isUpdating) return
    setError('')
    try {
      await onStatusChange?.(task.id, { status: nextStatus })
    } catch (err) {
      setError(err.message || '상태 변경에 실패했습니다.')
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="task-detail-title">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[11px] text-slate-400">{task.key}</p>
                <h3 id="task-detail-title" className="mt-1 text-lg font-semibold text-slate-900">
                  {task.title}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">{projectName}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="닫기"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-4 px-5 py-4">
            {task.description && (
              <p className="text-sm leading-relaxed text-slate-600">{task.description}</p>
            )}

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">상태</dt>
                <dd className="mt-1"><StatusBadge status={task.status} /></dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">우선순위</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${priority.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                    {priority.label}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">담당자</dt>
                <dd className="mt-1 text-slate-700">{task.assignee || task.assigneeName || '미배정'}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">마감일</dt>
                <dd className="mt-1 text-slate-700">{formatDueDate(task.dueDate)}</dd>
              </div>
            </dl>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">상태 변경</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {KANBAN_COLUMNS.map((column) => {
                  const isActive = currentStatus === column.status
                  return (
                    <button
                      key={column.key}
                      type="button"
                      disabled={isUpdating || isActive}
                      onClick={() => handleStatusChange(column.status)}
                      className={[
                        'rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed',
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-50',
                      ].join(' ')}
                    >
                      {column.label}
                    </button>
                  )
                })}
              </div>
              {isUpdating && (
                <p className="mt-2 text-xs text-slate-500">상태 변경 중...</p>
              )}
              {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            </div>

            {task.updatedAt && (
              <p className="text-[11px] text-slate-400">
                최근 업데이트 · {formatDateTime(task.updatedAt)}
              </p>
            )}
          </div>

          <div className="border-t border-slate-100 px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-md border border-slate-200 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
