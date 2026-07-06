import StatusBadge from '../dashboard/StatusBadge'
import { formatDateTime, formatDueDate } from '../../utils/dashboardFormat'

export default function TaskDetailPanel({ task, project, onClose }) {
  return (
    <div className="space-y-6">
      <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800">
        ← 보드로 돌아가기
      </button>
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
          {task.key?.charAt(0) ?? 'T'}
        </span>
        <div>
          <p className="font-mono text-xs text-slate-400">{task.key}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900">{task.title}</h1>
            <StatusBadge status={task.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">{project.name}</p>
        </div>
      </div>
      <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">작업 정보</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-400">상태</dt>
            <dd className="mt-1"><StatusBadge status={task.status} /></dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">담당자</dt>
            <dd className="mt-1 text-sm text-slate-700">{task.assignee || '-'}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">우선순위</dt>
            <dd className="mt-1 text-sm text-slate-700">{task.priority ?? '-'}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">마감일</dt>
            <dd className="mt-1 text-sm text-slate-700">{formatDueDate(task.dueDate)}</dd>
          </div>
        </dl>
        {task.updatedAt && (
          <p className="mt-6 text-xs text-slate-400">최근 업데이트 · {formatDateTime(task.updatedAt)}</p>
        )}
      </section>
    </div>
  )
}
