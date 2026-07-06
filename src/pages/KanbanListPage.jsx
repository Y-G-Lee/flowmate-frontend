import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProjects } from '../api/project'
import { createTask, fetchAllProjectTasks } from '../api/task'
import TaskFormModal from '../components/dashboard/TaskFormModal'
import TaskTable from '../components/project/TaskTable'
import { routePaths } from '../constants/routes'

const STATUS_FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'todo', label: '할 일' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'review', label: '검토' },
  { value: 'done', label: '완료' },
]

function normalizeStatus(status) {
  return (status ?? 'todo').toLowerCase().replace(/-/g, '_')
}

export default function KanbanListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [allTasks, setAllTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadTasks = async () => {
    const projectList = await fetchProjects()
    const tasks = await fetchAllProjectTasks(projectList)
    setProjects(projectList)
    setAllTasks(tasks)
  }

  useEffect(() => {
    let cancelled = false

    async function init() {
      setLoading(true)
      try {
        await loadTasks()
      } catch {
        if (!cancelled) {
          setAllTasks([])
          setProjects([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredTasks = allTasks.filter((task) => {
    const q = search.toLowerCase().trim()
    const matchesSearch =
      !q ||
      task.title?.toLowerCase().includes(q) ||
      task.projectName?.toLowerCase().includes(q) ||
      task.assigneeName?.toLowerCase().includes(q)
    const matchesStatus =
      statusFilter === 'all' || normalizeStatus(task.status) === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {loading ? (
          <p className="text-sm text-slate-500">작업을 불러오는 중...</p>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900">칸반보드</h2>
              <p className="mt-1 text-sm text-slate-500">{allTasks.length}개 작업</p>
            </div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="search"
                placeholder="프로젝트, 작업, 담당자 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <div className="flex flex-wrap gap-1.5">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setStatusFilter(f.value)}
                    className={`rounded-lg px-3 py-1.5 text-sm ${statusFilter === f.value ? 'bg-slate-900 text-white' : 'bg-white ring-1 ring-slate-200'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <section className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">작업 목록</h2>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  + 작업 추가
                </button>
              </div>
              <TaskTable
                tasks={filteredTasks}
                onTaskTitleClick={(task) =>
                  navigate(`${routePaths.projectBoard(task.projectId)}?task=${task.id}`)
                }
                emptyMessage="조건에 맞는 작업이 없습니다."
              />
            </section>
            <TaskFormModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              projects={projects}
              isSubmitting={isSubmitting}
              onSubmit={async (form) => {
                setIsSubmitting(true)
                try {
                  await createTask(form.projectId, form)
                  await loadTasks()
                  setModalOpen(false)
                } finally {
                  setIsSubmitting(false)
                }
              }}
            />
          </>
        )}
      </div>
    </main>
  )
}
