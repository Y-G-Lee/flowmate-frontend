import { Link, useLocation } from 'react-router-dom'
import { routePaths } from '../../constants/routes'
import { getAuth } from '../../utils/auth'
import LogoutButton from '../auth/LogoutButton'

const navItems = [
  {
    label: '대시보드',
    to: routePaths.dashboard(),
    match: (pathname) => pathname === '/dashboard',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    label: '팀',
    to: routePaths.team(),
    match: (pathname) => pathname === '/teams' || pathname.startsWith('/teams/'),
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 2.198a5.001 5.001 0 0 0-9.411 0M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 2.25a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-13.5 0a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
      </svg>
    ),
  },
  {
    label: '프로젝트',
    to: routePaths.projects(),
    match: (pathname) =>
      pathname === '/projects' ||
      pathname === '/projects/new' ||
      pathname.endsWith('/edit') ||
      (pathname.startsWith('/projects/') &&
        !pathname.includes('/kanban') &&
        !pathname.includes('/board')),
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
      </svg>
    ),
  },
  {
    label: '칸반보드',
    to: routePaths.kanbanList(),
    match: (pathname) =>
      pathname === '/kanban' ||
      pathname.includes('/board') ||
      pathname.includes('/kanban'),
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15M4.5 19.5h15a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5h-15A1.5 1.5 0 0 0 3 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
      </svg>
    ),
  },
]

const navLinkClass = (isActive) =>
  [
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
  ].join(' ')

function getInitials(name, email) {
  if (name?.trim()) return name.trim().charAt(0).toUpperCase()
  if (email?.trim()) return email.trim().charAt(0).toUpperCase()
  return 'U'
}

export default function Sidebar() {
  const { pathname } = useLocation()
  const user = getAuth()

  return (
    <aside className="flex h-svh w-60 shrink-0 flex-col border-r border-slate-200/80 bg-[#fbfbfa]">
      <div className="flex h-14 items-center gap-2 border-b border-slate-200/80 px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">
          F
        </span>
        <span className="text-[15px] font-semibold text-slate-900">Flowmate</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>
        {navItems.map((item) => {
          const isActive = item.match(pathname)

          return (
            <Link
              key={item.label}
              to={item.to}
              className={navLinkClass(isActive)}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-200/80 p-3">
        <div className="mb-3 flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {getInitials(user?.name, user?.email)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {user?.name || '게스트 사용자'}
            </p>
            <p className="truncate text-xs text-slate-500">{user?.email || 'guest@flowmate.com'}</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  )
}
