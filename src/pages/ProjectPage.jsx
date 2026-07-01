import { useParams } from 'react-router-dom'

export default function ProjectPage() {
  const { projectId } = useParams()

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-semibold text-slate-900">프로젝트</h1>
      <p className="mt-2 text-sm text-slate-500">프로젝트 ID: {projectId}</p>
    </main>
  )
}
