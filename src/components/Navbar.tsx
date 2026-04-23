import { useEffect, useMemo, useState } from 'react'
import './Navbar.css'

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
      cta: { label: 'Login', href: '/auth/login' }
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
    <header className="Navbar" role="banner">
      <div className="Navbar__inner">
        <a className="Navbar__brand" href={nav.brand.href}>
          {/* <span className="Navbar__mark" aria-hidden="true" /> */}
          <span className="Navbar__brandText">{nav.brand.label}</span>
        </a>

        <nav className="Navbar__nav" aria-label="Navigation principale">
          {nav.items.map((item) => (
            <a key={item.href} className="Navbar__link" href={item.href}>
              {item.label}
            </a>
          ))}
          <span className="Navbar__link">|</span>
          <a className="Navbar__cta" href={nav.cta.href}>
            {nav.cta.label} <ArrowUpRightIcon />
          </a>

        </nav>

        <div className="Navbar__actions">

          {/* <button className="Navbar__iconBtn" type="button" aria-label="Rechercher">
            <SearchIcon />
          </button> */}

          <button className="Navbar__pillBtn" type="button" aria-label="Menu">
            <span className="Navbar__pillLabel">Menu</span>
            <span className="Navbar__burger" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

