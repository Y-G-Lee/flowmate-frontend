import { useMemo, useState } from 'react'
import KanbanColumn from '../kanban/KanbanColumn'
import TaskDetailModal from '../kanban/TaskDetailModal'
import TaskFormModal from '../dashboard/TaskFormModal'
import { getKanbanColumnKey, KANBAN_COLUMNS } from '../../utils/taskFormat'

function matchesSearch(task, query) {
  if (!query.trim()) return true
  const q = query.toLowerCase()
  return (
    task.title?.toLowerCase().includes(q) ||
    task.key?.toLowerCase().includes(q) ||
    task.assignee?.toLowerCase().includes(q) ||
    task.assigneeName?.toLowerCase().includes(q)
  )
}

export default function ProjectBoardTab({
  project,
  onCreateTask,
  onUpdateTask,
}) {
  const [search, setSearch] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createDefaultStatus, setCreateDefaultStatus] = useState('todo')
  const [selectedTask, setSelectedTask] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const tasks = project.tasks ?? []

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => matchesSearch(task, search))
  }, [tasks, search])

  const tasksByColumn = useMemo(() => {
    const grouped = Object.fromEntries(KANBAN_COLUMNS.map((column) => [column.key, []]))
    for (const task of filteredTasks) {
      const columnKey = getKanbanColumnKey(task.status)
      grouped[columnKey]?.push(task)
    }
    return grouped
  }, [filteredTasks])

  const openCreateModal = (status = 'todo') => {
    setCreateDefaultStatus(status)
    setCreateModalOpen(true)
  }

  const handleCreateTask = async (form) => {
    if (!onCreateTask) return
    setIsSubmitting(true)
    try {
      await onCreateTask({ ...form, status: form.status || createDefaultStatus })
      setCreateModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (taskId, updates) => {
    if (!onUpdateTask) return
    setIsUpdating(true)
    try {
      const updated = await onUpdateTask(taskId, updates)
      if (updated) {
        setSelectedTask(updated)
      }
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <svg
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="search"
            placeholder="작업 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400/30"
          />
        </div>
        <button
          type="button"
          onClick={() => openCreateModal('todo')}
          className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          작업 추가
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {KANBAN_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.key}
            column={column}
            tasks={tasksByColumn[column.key] ?? []}
            onTaskClick={setSelectedTask}
            onAddTask={openCreateModal}
          />
        ))}
      </div>

      <TaskFormModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        fixedProjectId={project.id}
        defaultStatus={createDefaultStatus}
        isSubmitting={isSubmitting}
      />

      <TaskDetailModal
        open={Boolean(selectedTask)}
        task={selectedTask}
        projectName={project.name}
        onClose={() => setSelectedTask(null)}
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
      />
    </div>
  )
}
