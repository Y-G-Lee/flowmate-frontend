export default function AuthCard({ title, description, children, footer }) {
  return (
    <section className="w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
      <header className="mb-6 text-center sm:mb-8 sm:text-left">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
        )}
      </header>

      <div className="[&_form]:space-y-5 [&_form_button[type=submit]]:mt-1">{children}</div>

      {footer && (
        <footer className="mt-6 border-t border-slate-100 pt-6 text-center text-sm leading-relaxed text-slate-500 sm:mt-8 [&_a]:font-semibold [&_a]:text-brand-600 [&_a]:underline-offset-2 [&_a]:transition-colors [&_a]:hover:text-brand-700 [&_a]:hover:underline">
          {footer}
        </footer>
      )}
    </section>
  )
}
