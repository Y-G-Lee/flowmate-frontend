import { useMemo } from 'react'
import { formatRelativeTime } from '../../utils/dashboardFormat'
import StatusBadge from '../dashboard/StatusBadge'

function buildActivityItems(project) {
  const items = []

  if (project.createdAt) {
    items.push({
      id: `created-${project.id}`,
      type: 'project',
      title: '프로젝트가 생성되었습니다',
      meta: project.name,
      timestamp: project.createdAt,
    })
  }

  for (const task of project.tasks ?? []) {
    items.push({
      id: `task-${task.id}`,
      type: 'task',
      title: task.title,
      meta: `${task.key ?? `T-${task.id}`} · ${task.assignee || '미배정'}`,
      status: task.status,
      timestamp: task.updatedAt ?? task.createdAt,
    })
  }

  return items
    .filter((item) => item.timestamp)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export default function ProjectActivityTab({ project }) {
  const activities = useMemo(() => buildActivityItems(project), [project])

  return (
    <section className="rounded-lg border border-slate-200/80 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">활동</h2>
        <p className="mt-0.5 text-xs text-slate-500">프로젝트와 작업의 최근 활동</p>
      </div>

      {activities.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-slate-500">활동 내역이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {activities.map((item) => (
            <li key={item.id} className="flex items-start gap-3 px-4 py-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                  item.type === 'project'
                    ? 'bg-violet-100 text-violet-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {item.type === 'project' ? 'P' : 'T'}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium text-slate-900">{item.title}</p>
                  {item.status && <StatusBadge status={item.status} />}
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-500">{item.meta}</p>
              </div>
              <time className="shrink-0 text-[11px] text-slate-400">
                {formatRelativeTime(item.timestamp)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
