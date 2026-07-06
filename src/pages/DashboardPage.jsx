import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { fetchDashboard } from '../api/dashboard'

import { fetchProjects } from '../api/project'

import {

  createTask,

  deleteTask,

  mapRecentTask,

  updateTask,

} from '../api/task'

import RecentProjects from '../components/dashboard/RecentProjects'

import RecentTasks from '../components/dashboard/RecentTasks'

import { routePaths } from '../constants/routes'

import { clearAuth, getAuth } from '../utils/auth'



export default function DashboardPage() {

  const navigate = useNavigate()

  const user = getAuth()

  const displayName = user?.name || '게스트'



  const [dashboard, setDashboard] = useState(null)

  const [tasks, setTasks] = useState([])

  const [projects, setProjects] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')



  const applyDashboardTasks = (data, projectList) => {

    const recentTasks = data?.recentTasks ?? []

    setTasks(recentTasks.map((task) => mapRecentTask(task, projectList)))

  }



  const refreshDashboard = async () => {

    const [data, projectList] = await Promise.all([

      fetchDashboard(),

      fetchProjects(),

    ])

    setDashboard(data)

    setProjects(projectList)

    applyDashboardTasks(data, projectList)

  }



  useEffect(() => {

    let cancelled = false



    async function loadDashboard() {

      setLoading(true)

      setError('')



      try {

        const [data, projectList] = await Promise.all([

          fetchDashboard(),

          fetchProjects(),

        ])

        if (!cancelled) {

          setDashboard(data)

          setProjects(projectList)

          applyDashboardTasks(data, projectList)

        }

      } catch (err) {

        if (cancelled) return



        if (err.status === 401) {

          clearAuth()

          navigate(routePaths.login(), { replace: true })

          return

        }



        setError(err.message || '대시보드 조회에 실패했습니다.')

      } finally {

        if (!cancelled) {

          setLoading(false)

        }

      }

    }



    loadDashboard()



    return () => {

      cancelled = true

    }

  }, [navigate])



  if (loading) {

    return (

      <main className="flex flex-1 items-center justify-center">

        <p className="text-sm text-slate-500">대시보드를 불러오는 중...</p>

      </main>

    )

  }



  return (

    <main className="flex-1 overflow-y-auto">

      <div className="mx-auto max-w-6xl px-6 py-8">

        <div className="mb-8">

          <p className="text-sm text-slate-500">안녕하세요 👋</p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">

            {displayName}님, 오늘도 좋은 하루 되세요

          </h2>

          <p className="mt-2 text-sm text-slate-500">

            진행 중인 프로젝트와 작업을 한눈에 확인하세요.

          </p>

        </div>



        {error && (

          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

            {error}

          </p>

        )}



        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <StatCard

            label="진행 중 프로젝트"

            value={dashboard?.summary?.activeProjectCount ?? 0}

          />

          <StatCard

            label="할당된 작업"

            value={dashboard?.summary?.assignedTaskCount ?? 0}

          />

          <StatCard

            label="이번 주 완료"

            value={dashboard?.summary?.completedThisWeekCount ?? 0}

          />

        </div>



        <div className="flex flex-col gap-6">

          <RecentProjects projects={dashboard?.recentProjects ?? []} />

          <RecentTasks

            tasks={tasks}

            projects={projects}

            onCreateTask={async (form) => {

              await createTask(form.projectId, form)

              await refreshDashboard()

            }}

            onUpdateTask={async (task, form) => {

              await updateTask(task.projectId, task.id, form)

              await refreshDashboard()

            }}

            onDeleteTask={async (task) => {

              await deleteTask(task.projectId, task.id)

              await refreshDashboard()

            }}

          />

        </div>

      </div>

    </main>

  )

}



function StatCard({ label, value }) {

  return (

    <div className="rounded-xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">

      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>

    </div>

  )

}


