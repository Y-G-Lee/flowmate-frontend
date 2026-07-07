import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDueDate } from '../../utils/dashboardFormat'
import { formatPriorityLabel } from '../../utils/taskFormat'
import TaskFormModal from './TaskFormModal'
import { routePaths } from '../../constants/routes'
import StatusBadge from './StatusBadge'

export default function RecentTasks({ tasks = [], projects = [], onCreateTask, onUpdateTask, onDeleteTask }) {
  const navigate = useNavigate()
  const defaultProjectId = tasks[0]?.projectId
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editingTask, setEditingTask] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTaskClick = (task) => {
    if (!task.projectId) return
    navigate(`${routePaths.projectBoard(task.projectId)}?task=${task.id}`)
  }

  const openCreateModal = () => {
    setModalMode('create')
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEditModal = (task, e) => {
    e.stopPropagation()
    setModalMode('edit')
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleDelete = (task, e) => {
    e.stopPropagation()
    if (!window.confirm(`"${task.title}" 작업을 삭제하시겠습니까?`)) return
    onDeleteTask?.(task)
  }

  const handleSubmit = async (form) => {
    setIsSubmitting(true)
    try {
      if (modalMode === 'edit' && editingTask) {
        await onUpdateTask?.(editingTask, form)
      } else {
        await onCreateTask?.(form)
      }
      setModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">최근 작업</h2>
          <p className="mt-0.5 text-sm text-slate-500">내가 참여 중인 작업</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            + 작업 추가
          </button>
          {defaultProjectId && (
            <Link
              to={routePaths.projectBoard(defaultProjectId)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
            >
              칸반보드 →
            </Link>
          )}
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-slate-500">최근작업 없음</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">번호</th>
                <th className="px-5 py-3">작업</th>
                <th className="px-5 py-3">상태</th>
                <th className="px-5 py-3">담당</th>
                <th className="px-5 py-3">우선순위</th>
                <th className="px-5 py-3">마감</th>
                <th className="px-5 py-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`transition-colors hover:bg-slate-50/80 ${
                    task.projectId ? 'cursor-pointer' : ''
                  }`}
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-400">
                    {task.key ?? `#${task.id}`}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-900">{task.title}</p>
                    {task.projectName && (
                      <p className="mt-0.5 text-xs text-slate-400">{task.projectName}</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{task.assigneeName}</td>
                  <td className="px-5 py-3.5 text-slate-500">{formatPriorityLabel(task.priority)}</td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {formatDueDate(task.dueDate)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={(e) => openEditModal(task, e)}
                        className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(task, e)}
                        className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        initialValues={editingTask}
        projects={projects}
        fixedProjectId={modalMode === 'edit' ? editingTask?.projectId : undefined}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
