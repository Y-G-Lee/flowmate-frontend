import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../../components/auth/AuthCard'
import EmailFieldWithDuplicateCheck from '../../components/auth/EmailFieldWithDuplicateCheck'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import PasswordInput from '../../components/ui/PasswordInput'
import { routePaths } from '../../constants/routes'
import { signup } from '../../api/auth'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const [errors, setErrors] = useState({})
  const [emailCheckStatus, setEmailCheckStatus] = useState('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    if (name === 'email') {
      setEmailCheckStatus('idle')
    }
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = '이름을 입력해 주세요.'
    }

    if (!form.email.trim()) {
      nextErrors.email = '이메일을 입력해 주세요.'
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = '올바른 이메일 형식을 입력해 주세요.'
    } else if (emailCheckStatus !== 'available') {
      nextErrors.email = '이메일 중복 확인을 해주세요.'
    }

    if (!form.password) {
      nextErrors.password = '비밀번호를 입력해 주세요.'
    } else if (form.password.length < 8) {
      nextErrors.password = '비밀번호는 8자 이상이어야 합니다.'
    }

    if (!form.passwordConfirm) {
      nextErrors.passwordConfirm = '비밀번호 확인을 입력해 주세요.'
    } else if (form.password !== form.passwordConfirm) {
      nextErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
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
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      navigate(routePaths.login())
    } catch (error) {
      setSubmitError(error.message || '회원가입에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      title={'\ud68c\uc6d0\uac00\uc785'}
      description="Flowmate에서 팀과 프로젝트 협업을 시작해 보세요."
      footer={
        <>
          {'\uc774\ubbf8 \uacc4\uc815\uc774 \uc788\uc73c\uc2e0\uac00\uc694?'}{' '}
          <Link to={routePaths.login()} className="font-medium text-brand-600 hover:text-brand-700">
            {'\ub85c\uadf8\uc778'}
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          label={'\uc774\ub984'}
          type="text"
          name="name"
          autoComplete="name"
          placeholder={'\uc774\ub984\uc744 \uc785\ub825\ud558\uc138\uc694'}
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <EmailFieldWithDuplicateCheck
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          onCheckStatusChange={setEmailCheckStatus}
        />
        <PasswordInput
          label={'\ube44\ubc00\ubc88\ud638'}
          name="password"
          autoComplete="new-password"
          placeholder={'8\uc790 \uc774\uc0c1 \uc785\ub825\ud558\uc138\uc694'}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <PasswordInput
          label={'\ube44\ubc00\ubc88\ud638 \ud655\uc778'}
          name="passwordConfirm"
          autoComplete="new-password"
          placeholder={'\ube44\ubc00\ubc88\ud638\ub97c \ub2e4\uc2dc \uc785\ub825\ud558\uc138\uc694'}
          value={form.passwordConfirm}
          onChange={handleChange}
          error={errors.passwordConfirm}
        />
        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '가입 중...' : '회원가입'}
        </Button>
      </form>
    </AuthCard>
  )
}
