import { Link } from 'react-router-dom'
import { routePaths } from '../../constants/routes'
import { getTeamColor } from '../../utils/teamFormat'

function StatItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      <span className="text-slate-400">{icon}</span>
      <span>
        {label} <span className="font-medium text-slate-700">{value}</span>
      </span>
    </div>
  )
}

export default function TeamCard({ team }) {
  const description = team.description?.trim() || '설명이 없습니다.'

  return (
    <Link
      to={routePaths.teamDetail(team.id)}
      className="group flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="mb-4 flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm ${getTeamColor(team.id)}`}
        >
          {team.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-900 group-hover:text-brand-700">
            {team.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">{description}</p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
        <StatItem
          icon={
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          }
          label="멤버"
          value={`${team.memberCount ?? 0}명`}
        />
        <StatItem
          icon={
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
          }
          label="프로젝트"
          value={`${team.projectCount ?? 0}개`}
        />
      </div>
    </Link>
  )
}
