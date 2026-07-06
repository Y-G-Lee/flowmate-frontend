import { Link } from 'react-router-dom'
import { routePaths } from '../../constants/routes'
import { formatRelativeTime, getProjectColor } from '../../utils/dashboardFormat'
import ProjectProgressBar from './ProjectProgressBar'
import ProjectStatusBadge from './ProjectStatusBadge'

export default function ProjectCard({ project }) {
  const updatedLabel = formatRelativeTime(project.updatedAt ?? project.createdAt)

  return (
    <Link
      to={routePaths.project(project.id)}
      className="group flex flex-col rounded-lg border border-slate-200/80 bg-white p-3.5 transition-all hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white ${getProjectColor(project.id)}`}
          >
            {project.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-brand-700">
                {project.name}
              </h3>
              <ProjectStatusBadge status={project.status} />
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {project.description?.trim() || '설명 없음'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <ProjectProgressBar progress={project.progress} size="sm" showLabel={false} />
        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>{project.progress ?? 0}%</span>
          <span>{project.completedTaskCount ?? 0}/{project.taskCount ?? 0} 작업</span>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" />
          </svg>
          {project.memberCount ?? 0}명
        </span>
        <span>{updatedLabel}</span>
      </div>
    </Link>
  )
}
