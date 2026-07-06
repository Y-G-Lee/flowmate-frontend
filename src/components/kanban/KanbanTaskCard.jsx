import { formatDueDate } from '../../utils/dashboardFormat'
import { getPriorityConfig, isOverdue } from '../../utils/taskFormat'

export default function KanbanTaskCard({ task, onClick }) {
  const priority = getPriorityConfig(task.priority)
  const overdue = isOverdue(task.dueDate) && normalizeDone(task) === false

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(task)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(task)
        }
      }}
      className="cursor-pointer rounded-md border border-slate-200/80 bg-white p-2.5 shadow-sm transition-all hover:border-slate-300 hover:shadow"
    >
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] text-slate-400">{task.key}</span>
        <span
          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ${priority.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>
      </div>

      <p className="text-sm font-medium leading-snug text-slate-900">{task.title}</p>

      <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-slate-500">
        <span className="truncate">
          {task.assignee || task.assigneeName || '미배정'}
        </span>
        <span className={overdue ? 'font-medium text-red-600' : ''}>
          {task.dueDate ? formatDueDate(task.dueDate) : '마감 없음'}
        </span>
      </div>
    </article>
  )
}

function normalizeDone(task) {
  return (task.status ?? '').toLowerCase().replace(/-/g, '_') === 'done'
}
