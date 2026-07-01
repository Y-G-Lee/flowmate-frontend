import { NavLink, Outlet } from 'react-router-dom'
import LogoutButton from '../components/auth/LogoutButton'
import { routePaths } from '../constants/routes'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-100 text-brand-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')

export default function AppLayout() {
  return (
    <div className="flex min-h-svh bg-slate-50">
      <aside className="flex min-h-svh w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-5">
          <span className="text-lg font-semibold text-brand-700">Flowmate</span>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          <NavLink to={routePaths.dashboard()} end className={navLinkClass}>
            대시보드
          </NavLink>
          <NavLink to={routePaths.team('1')} className={navLinkClass}>
            팀
          </NavLink>
          <NavLink to={routePaths.project('1')} className={navLinkClass}>
            프로젝트
          </NavLink>
          <NavLink to={routePaths.kanban('1')} className={navLinkClass}>
            칸반보드
          </NavLink>
        </nav>
        <div className="mt-auto border-t border-slate-200 p-3">
          <LogoutButton />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}
