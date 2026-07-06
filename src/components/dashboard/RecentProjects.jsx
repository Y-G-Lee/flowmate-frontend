import { Link } from 'react-router-dom'
import { routePaths } from '../../constants/routes'
import {
  formatDateTime,
  formatProjectStatus,
  getProjectColor,
} from '../../utils/dashboardFormat'

export default function RecentProjects({ projects = [] }) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">최근 프로젝트</h2>
          <p className="mt-0.5 text-sm text-slate-500">최근 업데이트된 프로젝트</p>
        </div>
        <Link
          to={routePaths.projectNew()}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
        >
          + 새 프로젝트
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-slate-500">
          참여 중인 프로젝트가 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                to={routePaths.project(project.id)}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50/80"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${getProjectColor(project.id)}`}
                >
                  {project.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{project.name}</p>
                  <p className="mt-0.5 truncate text-sm text-slate-500">
                    {project.description || formatProjectStatus(project.status)} ·{' '}
                    {formatDateTime(project.updatedAt)}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-brand-500 transition-all"
                        style={{ width: `${project.progress ?? 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {project.progress ?? 0}%
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
