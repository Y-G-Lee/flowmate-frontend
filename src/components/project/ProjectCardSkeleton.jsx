export default function ProjectCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-slate-200/80 bg-white p-3.5">
      <div className="flex items-start gap-2.5">
        <div className="h-8 w-8 rounded-md bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-2/3 rounded bg-slate-100" />
          <div className="h-3 w-full rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100" />
      <div className="mt-3 flex justify-between">
        <div className="h-3 w-12 rounded bg-slate-100" />
        <div className="h-3 w-16 rounded bg-slate-100" />
      </div>
    </div>
  )
}
