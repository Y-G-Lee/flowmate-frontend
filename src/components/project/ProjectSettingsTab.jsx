import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteProject } from '../../api/project'
import { routePaths } from '../../constants/routes'
import { clearAuth } from '../../utils/auth'
import Button from '../ui/Button'

export default function ProjectSettingsTab({ project }) {
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (
      !window.confirm(
        `"${project.name}" 프로젝트를 삭제하시겠습니까?\n연결된 작업도 함께 삭제됩니다.`,
      )
    ) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteProject(project.id)
      navigate(routePaths.projects())
    } catch (err) {
      if (err.status === 401) {
        clearAuth()
        navigate(routePaths.login(), { replace: true })
        return
      }
      window.alert(err.message || '프로젝트 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200/80 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">일반</h2>
        <p className="mt-1 text-xs text-slate-500">프로젝트 이름, 설명, 상태, 마감일을 수정합니다.</p>
        <Link
          to={routePaths.projectEdit(project.id)}
          className="mt-3 inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          프로젝트 수정
        </Link>
      </section>

      <section className="rounded-lg border border-red-200/80 bg-red-50/30 p-4">
        <h2 className="text-sm font-semibold text-red-700">위험 구역</h2>
        <p className="mt-1 text-xs text-red-600/80">
          프로젝트를 삭제하면 연결된 작업과 멤버 정보가 함께 제거됩니다.
        </p>
        <Button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="mt-3 !w-auto border border-red-200 bg-white px-3 py-1.5 text-xs font-medium !text-red-600 hover:!bg-red-50"
          variant="secondary"
        >
          {isDeleting ? '삭제 중...' : '프로젝트 삭제'}
        </Button>
      </section>
    </div>
  )
}
