import KanbanTaskCard from './KanbanTaskCard'

export default function KanbanColumn({
  column,
  tasks = [],
  onTaskClick,
  onAddTask,
}) {
  return (
    <section className="flex min-h-[420px] w-72 shrink-0 flex-col rounded-lg border border-slate-200/80 bg-slate-50/50">
      <header className="flex items-center justify-between border-b border-slate-200/60 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            {column.label}
          </h3>
          <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-slate-500 ring-1 ring-slate-200">
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAddTask?.(column.status)}
          className="rounded px-1.5 py-0.5 text-xs font-medium text-slate-500 transition-colors hover:bg-white hover:text-slate-800"
          aria-label={`${column.label}에 작업 추가`}
        >
          +
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
        {tasks.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-200 px-3 py-8 text-center text-[11px] text-slate-400">
            작업 없음
          </p>
        ) : (
          tasks.map((task) => (
            <KanbanTaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))
        )}
      </div>
    </section>
  )
}
