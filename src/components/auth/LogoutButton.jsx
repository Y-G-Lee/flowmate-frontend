import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import { routePaths } from '../../constants/routes'
import { clearAuth } from '../../utils/auth'

export default function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate(routePaths.login())
  }

  return (
    <Button type="button" variant="secondary" onClick={handleLogout}>
      로그아웃
    </Button>
  )
}
