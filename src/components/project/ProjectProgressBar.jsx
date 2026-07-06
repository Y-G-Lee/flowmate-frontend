export default function ProjectProgressBar({ progress = 0, showLabel = true, size = 'md' }) {
  const value = Math.min(100, Math.max(0, progress ?? 0))
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2'

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 overflow-hidden rounded-full bg-slate-100 ${heightClass}`}>
        <div
          className={`rounded-full bg-brand-500 transition-all ${heightClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-xs font-medium tabular-nums text-slate-500">
          {value}%
        </span>
      )}
    </div>
  )
}
