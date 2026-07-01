import Button from '../ui/Button'

export default function AuthForm({ onSubmit, submitLabel, children }) {
  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div className="space-y-4">{children}</div>
      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
