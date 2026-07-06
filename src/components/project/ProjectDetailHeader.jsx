import { Link, NavLink } from 'react-router-dom'
import { routePaths } from '../../constants/routes'
import { formatRelativeTime, getProjectColor } from '../../utils/dashboardFormat'
import ProjectProgressBar from './ProjectProgressBar'
import ProjectStatusBadge from './ProjectStatusBadge'

const TABS = [
  { key: 'overview', label: 'Overview', path: (id) => routePaths.project(id), end: true },
  { key: 'board', label: 'Board', path: (id) => routePaths.projectBoard(id) },
  { key: 'members', label: 'Members', path: (id) => routePaths.projectMembers(id) },
  { key: 'activity', label: 'Activity', path: (id) => routePaths.projectActivity(id) },
  { key: 'settings', label: 'Settings', path: (id) => routePaths.projectSettings(id) },
]

function tabLinkClass({ isActive }) {
  return isActive ? 'tab-link active' : 'tab-link'
}

export default function ProjectDetailHeader({ project }) {
  const memberCount = project.memberCount ?? project.members?.length ?? 0
  const updatedLabel = formatRelativeTime(project.updatedAt ?? project.createdAt)

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Link
          to={routePaths.projects()}
          className="inline-flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-slate-800"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          프로젝트
        </Link>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>{memberCount}명</span>
          <span className="text-slate-300">·</span>
          <span>{project.taskCount ?? 0} 작업</span>
          <span className="text-slate-300">·</span>
          <span>{updatedLabel}</span>
        </div>
      </div>

      <div className="mb-3 flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${getProjectColor(project.id)}`}
        >
          {project.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">{project.name}</h1>
            <ProjectStatusBadge status={project.status} size="md" />
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {project.teamName}
            {project.description ? ` · ${project.description}` : ''}
          </p>
        </div>
      </div>

      <div className="mb-3 max-w-sm">
        <ProjectProgressBar progress={project.progress} size="sm" />
      </div>

      <nav className="-mb-px flex gap-5 overflow-x-auto border-b border-slate-200/80">
        {TABS.map((tab) => (
          <NavLink
            key={tab.key}
            to={tab.path(project.id)}
            end={tab.end}
            className={tabLinkClass}
            isActive={
              tab.key === 'board'
                ? (_match, location) => {
                    const base = `/projects/${project.id}`
                    return (
                      location.pathname === `${base}/board` ||
                      location.pathname === `${base}/kanban`
                    )
                  }
                : undefined
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
