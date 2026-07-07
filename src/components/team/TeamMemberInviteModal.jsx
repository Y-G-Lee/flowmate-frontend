import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatUserLabel, searchUsers } from '../../api/user'
import Button from '../ui/Button'

export default function TeamMemberInviteModal({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  existingUserIds = [],
}) {
  const [keyword, setKeyword] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (!open) return
    setKeyword('')
    setSelectedUser(null)
    setResults([])
    setIsSearching(false)
    setSearchError('')
    setSubmitError('')
    setShowDropdown(false)
  }, [open])

  useEffect(() => {
    if (!open || selectedUser) return

    const trimmed = keyword.trim()
    if (!trimmed) {
      setResults([])
      setSearchError('')
      setIsSearching(false)
      setShowDropdown(false)
      return
    }

    setIsSearching(true)
    setSearchError('')

    const timer = setTimeout(async () => {
      try {
        const users = await searchUsers(trimmed)
        const filtered = users.filter(
          (user) =>
            !existingUserIds.some((id) => String(id) === String(user.id ?? user.userId)),
        )
        setResults(filtered)
        setShowDropdown(true)
      } catch (err) {
        setResults([])
        setSearchError(err.message || '사용자 검색에 실패했습니다.')
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [keyword, open, selectedUser, existingUserIds])

  if (!open) return null

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value)
    setSelectedUser(null)
    setSubmitError('')
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setKeyword(formatUserLabel(user))
    setResults([])
    setShowDropdown(false)
    setSubmitError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedUser) {
      setSubmitError('추가할 사용자를 검색 후 선택해 주세요.')
      return
    }

    const userId = selectedUser.id ?? selectedUser.userId
    if (!userId) {
      setSubmitError('선택한 사용자 정보가 올바르지 않습니다.')
      return
    }

    if (existingUserIds.some((id) => String(id) === String(userId))) {
      setSubmitError('이미 참여 중인 멤버입니다.')
      return
    }

    setSubmitError('')
    try {
      await onSubmit?.({ userId: Number(userId) })
    } catch (err) {
      setSubmitError(err.message || '멤버 추가에 실패했습니다.')
    }
  }

  const displayError = submitError || searchError

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="team-member-invite-title">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 id="team-member-invite-title" className="text-lg font-semibold text-slate-900">
            팀 멤버 추가
          </h3>
          <p className="mt-1 text-sm text-slate-500">이름 또는 이메일로 사용자를 검색하세요.</p>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            <div className="relative space-y-1.5">
              <label htmlFor="team-member-search" className="block text-sm font-medium text-slate-700">
                사용자 검색
              </label>
              <input
                id="team-member-search"
                type="search"
                value={keyword}
                onChange={handleKeywordChange}
                onFocus={() => {
                  if (results.length > 0 && !selectedUser) setShowDropdown(true)
                }}
                placeholder="이름 또는 이메일 입력"
                autoComplete="off"
                autoFocus
                className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              {isSearching && <p className="text-sm text-slate-500">검색 중...</p>}
              {showDropdown && results.length > 0 && !selectedUser && (
                <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  {results.map((user) => (
                    <li key={user.id ?? user.userId ?? user.email}>
                      <button
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                      >
                        {formatUserLabel(user)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {showDropdown &&
                !isSearching &&
                keyword.trim() &&
                results.length === 0 &&
                !selectedUser &&
                !searchError && (
                  <p className="text-sm text-slate-500">검색 결과가 없습니다.</p>
                )}
              {displayError && <p className="text-sm text-red-600">{displayError}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex flex-[1] basis-0 items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                취소
              </button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-[9] basis-0 !w-auto justify-center px-6"
              >
                {isSubmitting ? '추가 중...' : '추가하기'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  )
}
