import { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import { motion, useScroll, useSpring, MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import LeistungenPage from './pages/LeistungenPage'
import ContactPage from './pages/ContactPage'
import ImpressumPage from './pages/ImpressumPage'
import DatenschutzPage from './pages/DatenschutzPage'

// Resets scroll on route change; scrolls to a section if requested via nav state.
function ScrollManager() {
  const { pathname, state } = useLocation()
  useEffect(() => {
    const id = state?.scrollTo
    if (id) {
      requestAnimationFrame(() => {
        if (id === 'top') {
          window.scrollTo(0, 0)
        } else {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, state])
  return null
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-accent-2 to-accent"
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ScrollProgress />
        <div className="grain" />
        <ScrollManager />

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leistungen" element={<LeistungenPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
        </Routes>

        <Footer />
      </MotionConfig>
    </BrowserRouter>
  )
}
