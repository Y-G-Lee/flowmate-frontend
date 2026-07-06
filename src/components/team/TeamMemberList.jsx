import { formatTeamRole, getInitials } from '../../utils/teamFormat'

function getRoleClass(role) {
  return role?.toUpperCase() === 'OWNER'
    ? 'bg-violet-50 text-violet-700 ring-violet-100'
    : 'bg-slate-50 text-slate-600 ring-slate-100'
}

export default function TeamMemberList({ members = [] }) {
  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
        <p className="text-sm text-slate-500">등록된 멤버가 없습니다.</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-slate-100">
      {members.map((member) => {
        const displayName = member.name || member.email
        return (
          <li key={member.userId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
              {getInitials(displayName, '?')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-900">{displayName}</p>
              <p className="truncate text-sm text-slate-500">{member.email}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getRoleClass(member.teamRole)}`}
            >
              {formatTeamRole(member.teamRole)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
