import { useLocation } from 'react-router-dom'
import { getAuth } from '../../utils/auth'

const PAGE_TITLES = {
  '/dashboard': '대시보드',
}

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname === '/teams') return '팀'
  if (pathname.startsWith('/teams/')) return '팀 상세'
  if (pathname === '/projects') return '프로젝트'
  if (pathname === '/projects/new') return '새 프로젝트'
  if (pathname === '/kanban') return '칸반보드'
  if (pathname.includes('/board') || pathname.includes('/kanban')) return '보드'
  if (pathname.includes('/members')) return '멤버'
  if (pathname.includes('/activity')) return '활동'
  if (pathname.includes('/settings')) return '설정'
  if (pathname.startsWith('/projects/')) return '프로젝트'
  return 'Flowmate'
}

function getInitials(name, email) {
  if (name?.trim()) return name.trim().charAt(0).toUpperCase()
  if (email?.trim()) return email.trim().charAt(0).toUpperCase()
  return 'U'
}

export default function AppHeader() {
  const { pathname } = useLocation()
  const user = getAuth()
  const pageTitle = getPageTitle(pathname)

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-sm">
      <h1 className="text-lg font-semibold text-slate-900">{pageTitle}</h1>

      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="relative hidden max-w-sm flex-1 sm:block">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="search"
            placeholder="프로젝트, 작업 검색..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
            {getInitials(user?.name, user?.email)}
          </span>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-medium text-slate-900">
              {user?.name || '게스트 사용자'}
            </p>
            <p className="truncate text-xs text-slate-500">{user?.email || 'guest@flowmate.com'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
