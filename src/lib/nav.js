import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Smart section navigation:
 * - On the home page → smooth-scroll to the section.
 * - On any other page → navigate home, then scroll (handled by ScrollManager).
 * Pass 'top' to go to the very top.
 */
export function useGo() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (id) => {
    if (pathname === '/') {
      if (id === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }
}
