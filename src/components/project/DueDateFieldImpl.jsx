import { createElement } from 'react'
import DatePicker from '../ui/DatePicker'

export default function DueDateFieldImpl({ value, onChange }) {
  return createElement(DatePicker, { label: '마감일', name: 'dueDate', value, onChange })
}
