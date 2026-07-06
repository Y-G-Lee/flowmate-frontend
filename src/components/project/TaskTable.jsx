import StatusBadge from '../dashboard/StatusBadge'

export default function TaskTable({ tasks = [], onTaskTitleClick, emptyMessage = '표시할 작업이 없습니다.' }) {
  if (tasks.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-sm text-slate-500">{emptyMessage}</p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
            <th className="px-5 py-3">프로젝트명</th>
            <th className="px-5 py-3">최근 작업</th>
            <th className="px-5 py-3">담당자명</th>
            <th className="px-5 py-3">상태</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <tr key={`${task.projectId}-${task.id}`} className="transition-colors hover:bg-slate-50/80">
              <td className="px-5 py-3.5 text-slate-700">{task.projectName ?? '-'}</td>
              <td className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => onTaskTitleClick?.(task)}
                  className="text-left font-medium text-slate-900 transition-colors hover:text-brand-600"
                >
                  {task.title}
                </button>
                {task.key && (
                  <p className="mt-0.5 font-mono text-xs text-slate-400">{task.key}</p>
                )}
              </td>
              <td className="px-5 py-3.5 text-slate-600">{task.assigneeName || task.assignee || '-'}</td>
              <td className="px-5 py-3.5">
                <StatusBadge status={task.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
