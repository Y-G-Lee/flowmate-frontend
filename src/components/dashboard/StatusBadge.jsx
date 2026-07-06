import { normalizeStatus } from '../../utils/dashboardFormat'

const STATUS_CONFIG = {
  todo: { label: '할 일', className: 'bg-slate-100 text-slate-600' },
  in_progress: { label: '진행 중', className: 'bg-blue-50 text-blue-700' },
  review: { label: '검토', className: 'bg-amber-50 text-amber-700' },
  done: { label: '완료', className: 'bg-emerald-50 text-emerald-700' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[normalizeStatus(status)] ?? STATUS_CONFIG.todo

  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
