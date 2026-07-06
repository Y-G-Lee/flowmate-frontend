import { useEffect, useRef, useState } from 'react'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function toIso(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function formatDotDate(iso) {
  const [y, m, d] = iso.split('-')
  return y && m && d ? `${y}.${m}.${d}` : iso
}

function parseIso(v) {
  if (!v) return null
  const [y, m, d] = v.split('-').map(Number)
  return y && m && d ? new Date(y, m - 1, d) : null
}

export default function DatePicker({ label, name, value = '', onChange, id, error }) {
  const inputId = id ?? name
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const sel = parseIso(value) ?? new Date()
  const [y, setY] = useState(sel.getFullYear())
  const [m, setM] = useState(sel.getMonth())

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  useEffect(() => {
    const parsed = parseIso(value)
    if (parsed) {
      setY(parsed.getFullYear())
      setM(parsed.getMonth())
    }
  }, [value])

  const first = new Date(y, m, 1).getDay()
  const total = new Date(y, m + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]

  const pick = (day) => {
    onChange?.({ target: { name, value: toIso(y, m, day) } })
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <button
        id={inputId}
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2.5 text-sm ${error ? 'border-red-300' : 'border-slate-200'} ${value ? 'text-slate-900' : 'text-slate-400'}`}
      >
        {value ? formatDotDate(value) : '날짜 선택'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {open && (
        <div className="absolute z-50 mt-2 w-[300px] rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => (m === 0 ? (setM(11), setY(y - 1)) : setM(m - 1))}
              className="rounded-md px-2 py-1 text-base hover:bg-slate-100"
            >
              ‹
            </button>
            <p className="text-sm font-semibold text-slate-800">
              {y}년 {m + 1}월
            </p>
            <button
              type="button"
              onClick={() => (m === 11 ? (setM(0), setY(y + 1)) : setM(m + 1))}
              className="rounded-md px-2 py-1 text-base hover:bg-slate-100"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
            {WEEKDAYS.map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((day, i) =>
              day ? (
                <button
                  key={toIso(y, m, day)}
                  type="button"
                  onClick={() => pick(day)}
                  className={`flex h-9 w-9 items-center justify-center rounded-md text-sm ${value === toIso(y, m, day) ? 'bg-brand-600 font-medium text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {day}
                </button>
              ) : (
                <span key={`e-${i}`} className="h-9 w-9" />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}
