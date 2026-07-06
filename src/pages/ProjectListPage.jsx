import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchProjects } from '../api/project'
import ProjectCard from '../components/project/ProjectCard'
import ProjectCardSkeleton from '../components/project/ProjectCardSkeleton'
import { routePaths } from '../constants/routes'
import { clearAuth } from '../utils/auth'
import { normalizeStatus } from '../utils/dashboardFormat'

const STATUS_FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'planning', label: '기획' },
  { value: 'completed', label: '완료' },
  { value: 'on_hold', label: '보류' },
]

export default function ProjectListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProjects() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchProjects()
        if (!cancelled) {
          setProjects(data)
        }
      } catch (err) {
        if (cancelled) return

        if (err.status === 401) {
          clearAuth()
          navigate(routePaths.login(), { replace: true })
          return
        }

        setError(err.message || '프로젝트 목록을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProjects()

    return () => {
      cancelled = true
    }
  }, [navigate])

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        !search.trim() ||
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.teamName?.toLowerCase().includes(search.toLowerCase()) ||
        project.description?.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        normalizeStatus(project.status) === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [projects, search, statusFilter])

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50/60">
      <div className="mx-auto max-w-6xl px-5 py-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Projects
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900">프로젝트</h1>
            <p className="mt-1 text-xs text-slate-500">
              {loading ? '불러오는 중...' : `${projects.length}개 워크스페이스`}
            </p>
          </div>
          <Link
            to={routePaths.projectNew()}
            className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            새 프로젝트
          </Link>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}

        <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <svg
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="search"
              placeholder="프로젝트 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400/30"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={[
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  statusFilter === filter.value
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
                ].join(' ')}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-12 text-center">
            <p className="text-sm text-slate-500">조건에 맞는 프로젝트가 없습니다.</p>
            <Link
              to={routePaths.projectNew()}
              className="mt-3 inline-block text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              새 프로젝트 만들기
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
