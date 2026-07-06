import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Button from '../ui/Button'
import { formatUserLabel, searchUsers } from '../../api/user'
import { getAuth } from '../../utils/auth'
import { isProjectOwner } from '../../utils/projectMembers'

const ROLE_COLORS = {
  OWNER: 'bg-violet-100 text-violet-700',
  MEMBER: 'bg-slate-100 text-slate-600',
}

function formatMemberRoleLabel(role) {
  return role?.toUpperCase() === 'OWNER' ? '생성자' : '팀원'
}

function getMemberRoleClass(role) {
  return role?.toUpperCase() === 'OWNER' ? ROLE_COLORS.OWNER : ROLE_COLORS.MEMBER
}

function MemberInviteModal({
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

  const handleSubmit = (e) => {
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

    onSubmit?.({ userId: Number(userId) })
  }

  const displayError = submitError || searchError

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="member-invite-title">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 id="member-invite-title" className="text-lg font-semibold text-slate-900">
            멤버 추가
          </h3>
          <p className="mt-1 text-sm text-slate-500">이름 또는 이메일로 사용자를 검색하세요.</p>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            <div className="relative space-y-1.5">
              <label htmlFor="member-search" className="block text-sm font-medium text-slate-700">
                사용자 검색
              </label>
              <input
                id="member-search"
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
                className="inline-flex flex-[1] basis-0 items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
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

function MemberRow({ member, canManageMembers, checked = false, onToggle }) {
  const roleClass = getMemberRoleClass(member.role)
  const roleLabel = formatMemberRoleLabel(member.role)
  const displayName = member.name ?? member.nickname ?? '멤버'
  const isOwnerMember = member.role?.toUpperCase() === 'OWNER'
  const showCheckbox = canManageMembers && !isOwnerMember

  return (
    <li className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/80">
      {showCheckbox ? (
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle?.(member)}
          aria-label={`${displayName} 선택`}
          className="h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
      ) : (
        <span className="w-4 shrink-0" aria-hidden="true" />
      )}
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
        {member.avatar ?? displayName.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-900">{displayName}</p>
        <p className="truncate text-sm text-slate-500">{member.email}</p>
      </div>
      <span className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium ${roleClass}`}>
        {roleLabel}
      </span>
    </li>
  )
}

export default function ProjectMembersTab({
  members = [],
  onInviteMember,
  onRemoveMembers,
  isSubmitting = false,
  isRemoving = false,
  inviteError = '',
  removeError = '',
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const auth = getAuth()
  const isOwner = isProjectOwner(members, auth)

  useEffect(() => {
    if (!isOwner) {
      setSelectedIds([])
    }
  }, [isOwner])

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => members.some((member) => String(member.userId ?? member.id) === id)),
    )
  }, [members])

  const getMemberId = (member) => String(member.userId ?? member.id)

  const toggleMember = (member) => {
    const id = getMemberId(member)
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleBulkRemove = async () => {
    const selectedMembers = members.filter((member) => selectedIds.includes(getMemberId(member)))
    if (selectedMembers.length === 0) return

    try {
      await onRemoveMembers?.(selectedMembers)
      setSelectedIds([])
    } catch {
      // 상위에서 removeError 표시
    }
  }

  const handleSubmit = async (form) => {
    try {
      await onInviteMember?.(form)
      setModalOpen(false)
    } catch {
      // 상위에서 inviteError 표시, 모달은 유지
    }
  }

  const hasSelection = selectedIds.length > 0

  return (
    <section className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">팀 멤버</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {members.length}명이 이 프로젝트에 참여 중입니다.
          </p>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              + 멤버 추가
            </button>
            <button
              type="button"
              onClick={handleBulkRemove}
              disabled={!hasSelection || isRemoving}
              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 disabled:hover:bg-white"
            >
              {isRemoving ? '삭제 중...' : '삭제'}
            </button>
          </div>
        )}
      </div>

      {(inviteError || removeError) && (
        <p className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-600">
          {inviteError || removeError}
        </p>
      )}

      {members.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-slate-500">아직 멤버가 없습니다.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {members.map((member) => (
            <MemberRow
              key={member.id ?? member.userId ?? member.email}
              member={member}
              canManageMembers={isOwner}
              checked={selectedIds.includes(getMemberId(member))}
              onToggle={toggleMember}
            />
          ))}
        </ul>
      )}

      <MemberInviteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        existingUserIds={members.map((member) => member.userId ?? member.id).filter(Boolean)}
      />
    </section>
  )
}
