import { Link } from 'react-router-dom'
import ProjectProgressBar from '../project/ProjectProgressBar'
import ProjectStatusBadge from '../project/ProjectStatusBadge'
import { routePaths } from '../../constants/routes'
import { getProjectColor } from '../../utils/dashboardFormat'

export default function TeamProjectList({ projects = [] }) {
  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
        <p className="text-sm text-slate-500">등록된 프로젝트가 없습니다.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {projects.map((project) => (
        <li key={project.id}>
          <Link
            to={routePaths.project(project.id)}
            className="group flex items-center gap-3 rounded-lg border border-slate-200/80 bg-slate-50/40 px-4 py-3 transition-colors hover:border-brand-200 hover:bg-white"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white ${getProjectColor(project.id)}`}
            >
              {project.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-medium text-slate-900 group-hover:text-brand-700">
                  {project.name}
                </p>
                <ProjectStatusBadge status={project.status} />
              </div>
              <div className="mt-2 max-w-xs">
                <ProjectProgressBar progress={project.progress} size="sm" />
              </div>
            </div>
            <svg
              className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-brand-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </li>
      ))}
    </ul>
  )
}
