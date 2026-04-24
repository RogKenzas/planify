import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import OnClickBtn from './onClickbtn'
import { BiMenuAltRight } from 'react-icons/bi'

type NavItem = {
  label: string
  href: string
}

type NavResponse = {
  brand: { label: string; href: string }
  items: NavItem[]
  cta: { label: string; href: string }
}



function ArrowUpRightIcon() {
  return (
    <svg
      className="Navbar__icon Navbar__icon--cta"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M7 17a1 1 0 0 1 0-2h7.59L6.7 7.11a1 1 0 1 1 1.41-1.41L16 13.59V6a1 1 0 1 1 2 0v10a1 1 0 0 1-1 1z"
      />
    </svg>
  )
}

export function Navbar() {
  const fallback = useMemo<NavResponse>(
    () => ({
      brand: { label: 'Planify', href: '/' },
      items: [
        { label: 'Services', href: '/services' },
        { label: 'Schedule', href: '/schedule' },
        { label: 'About', href: '/about' },
      ],
      cta: { label: 'Login', href: '/login' }
    }),
    []
  )

  const [nav, setNav] = useState<NavResponse>(fallback)

  useEffect(() => {
    let cancelled = false

    fetch('/api/nav')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return (await res.json()) as NavResponse
      })
      .then((data) => {
        if (!cancelled) setNav(data)
      })
      .catch(() => {
      })

    return () => {
      cancelled = true
    }
  }, [fallback])

  return (
    <header className="Navbar animate-fade-in" role="banner">
      <div className="Navbar__inner">
        <Link className="Navbar__brand" to={nav.brand.href}>
          <span className="Navbar__brandText">{nav.brand.label}</span>
        </Link>

        <nav className="Navbar__nav" aria-label="Navigation principale">
          {nav.items.map((item) => (
            <Link key={item.href} className="Navbar__link" to={item.href}>
              {item.label}
            </Link>
          ))}
          <span className="Navbar__link">|</span>
          <Link className="Navbar__cta" to={nav.cta.href}>
            {nav.cta.label} <ArrowUpRightIcon />
          </Link>

        </nav>

        <div className="Navbar__actions">
          <OnClickBtn color='#000'
            label="Menu"
            icon={<BiMenuAltRight size={18} />}
            onClick={() => console.log("Go to login")} bgColor={''}
          />
        </div>
      </div>
    </header>
  )
}

