import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-brand-50/40 to-slate-100 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 w-full max-w-md text-center sm:mb-8">
        <p className="text-2xl font-bold tracking-tight text-brand-700 sm:text-3xl">Flowmate</p>
        <p className="mt-1.5 text-sm text-slate-500">팀과 프로젝트를 함께 관리하세요</p>
      </div>

      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
