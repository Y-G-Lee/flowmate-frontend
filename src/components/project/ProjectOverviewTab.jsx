import { formatDateTime, formatRelativeTime } from '../../utils/dashboardFormat'
import ProjectProgressBar from './ProjectProgressBar'
import ProjectStatusBadge from './ProjectStatusBadge'
import StatusBadge from '../dashboard/StatusBadge'

export default function ProjectOverviewTab({ project }) {
  const stats = [
    { label: '전체 작업', value: project.taskCount ?? 0 },
    { label: '완료', value: project.completedTaskCount ?? 0 },
    { label: '멤버', value: project.memberCount ?? project.members?.length ?? 0 },
    { label: '진행률', value: `${project.progress ?? 0}%` },
  ]

  const recentTasks = (project.tasks ?? []).slice(0, 8)

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200/80 bg-white px-3.5 py-3"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {stat.label}
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-slate-200/80 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">소개</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {project.description || '프로젝트 설명이 없습니다.'}
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">상태</dt>
            <dd className="mt-1">
              <ProjectStatusBadge status={project.status} size="md" />
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">팀</dt>
            <dd className="mt-1 text-sm text-slate-700">{project.teamName || '-'}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">생성일</dt>
            <dd className="mt-1 text-sm text-slate-700">
              {formatDateTime(project.startDate ?? project.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">마감일</dt>
            <dd className="mt-1 text-sm text-slate-700">
              {project.deadline ? formatDateTime(project.deadline) : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">최근 업데이트</dt>
            <dd className="mt-1 text-sm text-slate-700">
              {formatRelativeTime(project.updatedAt ?? project.createdAt)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-slate-200/80 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">진행률</h2>
          <span className="text-xs text-slate-500">
            {project.completedTaskCount ?? 0}/{project.taskCount ?? 0}
          </span>
        </div>
        <ProjectProgressBar progress={project.progress} size="sm" />
      </section>

      <section className="rounded-lg border border-slate-200/80 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">최근 작업</h2>
        </div>
        {recentTasks.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">작업이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-mono text-slate-400">{task.key}</p>
                  <p className="truncate text-sm font-medium text-slate-900">
                    {task.title}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="hidden text-xs text-slate-500 sm:inline">
                    {task.assignee}
                  </span>
                  <StatusBadge status={task.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
