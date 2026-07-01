import { useParams } from 'react-router-dom'

export default function TeamPage() {
  const { teamId } = useParams()

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-semibold text-slate-900">팀</h1>
      <p className="mt-2 text-sm text-slate-500">팀 ID: {teamId}</p>
    </main>
  )
}
