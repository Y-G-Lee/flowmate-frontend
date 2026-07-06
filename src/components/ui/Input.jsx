export default function Input({ label, error, id, className = '', ...props }) {
  const inputId = id ?? props.name

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900',
          'placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
          error ? 'border-red-300' : 'border-slate-200',
          className,
        ].join(' ')}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
