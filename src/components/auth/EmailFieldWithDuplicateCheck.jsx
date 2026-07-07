import { useState } from 'react'
import { checkEmailDuplicate } from '../../api/auth'
import { sanitizeEmailInput } from '../../utils/emailInput'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function EmailFieldWithDuplicateCheck({
  value,
  onChange,
  error,
  onCheckStatusChange,
}) {
  const [checkStatus, setCheckStatus] = useState('idle')
  const [successMessage, setSuccessMessage] = useState('')
  const [checkError, setCheckError] = useState('')

  const updateStatus = (status, message = '') => {
    setCheckStatus(status)
    setSuccessMessage(message)
    setCheckError('')
    onCheckStatusChange?.(status)
  }

  const handleEmailChange = (event) => {
    const sanitizedValue = sanitizeEmailInput(event.target.value)

    onChange({
      ...event,
      target: {
        ...event.target,
        name: event.target.name,
        value: sanitizedValue,
      },
    })
    updateStatus('idle')
  }

  const handleDuplicateCheck = async () => {
    const email = value.trim()

    if (!email) {
      updateStatus('error')
      return
    }

    if (!EMAIL_PATTERN.test(email)) {
      updateStatus('error')
      return
    }

    updateStatus('checking')

    try {
      const { isAvailable } = await checkEmailDuplicate(email)

      if (isAvailable) {
        updateStatus('available', '사용 가능한 이메일입니다.')
      } else {
        updateStatus('duplicate')
      }
    } catch (error) {
      setCheckStatus('error')
      setCheckError(error.message || '이메일 중복 확인에 실패했습니다.')
      onCheckStatusChange?.('idle')
    }
  }

  const displayError =
    error ||
    checkError ||
    (checkStatus === 'duplicate' ? '이미 사용 중인 이메일입니다.' : '') ||
    (checkStatus === 'error' && !error && !checkError ? '이메일을 입력해 주세요.' : '')

  return (
    <div className="space-y-1.5">
      <label htmlFor="email" className="block text-sm font-medium text-slate-700">
        이메일
      </label>
      <div className="flex gap-2">
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="이메일@example.com"
          value={value}
          onChange={handleEmailChange}
          className={[
            'min-w-0 flex-1 rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900',
            'placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
            displayError ? 'border-red-300' : 'border-slate-200',
          ].join(' ')}
          aria-invalid={Boolean(displayError)}
        />
        <button
          type="button"
          onClick={handleDuplicateCheck}
          disabled={checkStatus === 'checking'}
          className={[
            'shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700',
            'transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ].join(' ')}
        >
          {checkStatus === 'checking' ? '확인 중...' : '중복확인'}
        </button>
      </div>
      {successMessage && checkStatus === 'available' && (
        <p className="text-sm text-green-600">{successMessage}</p>
      )}
      {displayError && <p className="text-sm text-red-600">{displayError}</p>}
    </div>
  )
}
