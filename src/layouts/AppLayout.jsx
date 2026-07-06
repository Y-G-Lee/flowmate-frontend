import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import AppHeader from '../components/layout/AppHeader'

export default function AppLayout() {
  return (
    <div className="flex h-svh overflow-hidden bg-[#f7f6f3]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <Outlet />
      </div>
    </div>
  )
}
