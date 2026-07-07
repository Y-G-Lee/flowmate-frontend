import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../../components/auth/AuthCard'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import PasswordInput from '../../components/ui/PasswordInput'
import { login } from '../../api/auth'
import { routePaths } from '../../constants/routes'
import { setAuth } from '../../utils/auth'
import { sanitizeEmailInput } from '../../utils/emailInput'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    const nextValue = name === 'email' ? sanitizeEmailInput(value) : value
    setForm((prev) => ({ ...prev, [name]: nextValue }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setSubmitError('')
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.email.trim()) {
      nextErrors.email = '이메일을 입력해 주세요.'
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = '올바른 이메일 형식을 입력해 주세요.'
    }

    if (!form.password) {
      nextErrors.password = '비밀번호를 입력해 주세요.'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const data = await login({
        email: form.email,
        password: form.password,
      })
      setAuth(data)
      navigate(routePaths.dashboard())
    } catch (error) {
      setSubmitError(error.message || '로그인에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      title={'\ub85c\uadf8\uc778'}
      description="Flowmate 계정으로 로그인하고 프로젝트를 이어가세요."
      footer={
        <>
          {'\uacc4\uc815\uc774 \uc5c6\uc73c\uc2e0\uac00\uc694?'}{' '}
          <Link to={routePaths.signup()} className="font-medium text-brand-600 hover:text-brand-700">
            {'\ud68c\uc6d0\uac00\uc785'}
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          label={'\uc774\uba54\uc77c'}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="이메일을 입력하세요"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <PasswordInput
          label={'\ube44\ubc00\ubc88\ud638'}
          name="password"
          autoComplete="current-password"
          placeholder={'\ube44\ubc00\ubc88\ud638\ub97c \uc785\ub825\ud558\uc138\uc694'}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </Button>
      </form>
    </AuthCard>
  )
}
