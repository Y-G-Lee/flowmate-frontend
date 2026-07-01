import { Link } from 'react-router-dom'
import { authLinkClass } from './authStyles'

export default function AuthFooter({ message, linkTo, linkLabel }) {
  return (
    <p className="text-center text-sm leading-relaxed text-slate-500">
      {message}{' '}
      <Link to={linkTo} className={authLinkClass}>
        {linkLabel}
      </Link>
    </p>
  )
}
