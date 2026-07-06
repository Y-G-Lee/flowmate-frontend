const PROJECT_STATUS_CONFIG = {
  planning: { label: '기획', className: 'bg-slate-100 text-slate-600' },
  in_progress: { label: '진행 중', className: 'bg-blue-50 text-blue-700' },
  completed: { label: '완료', className: 'bg-emerald-50 text-emerald-700' },
  on_hold: { label: '보류', className: 'bg-amber-50 text-amber-700' },
}

export default function ProjectStatusBadge({ status, size = 'sm' }) {
  const normalized = (status ?? 'planning').toLowerCase().replace(/-/g, '_')
  const config = PROJECT_STATUS_CONFIG[normalized] ?? PROJECT_STATUS_CONFIG.planning
  const sizeClass = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-xs'

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium ${sizeClass} ${config.className}`}
    >
      {config.label}
    </span>
  )
}
