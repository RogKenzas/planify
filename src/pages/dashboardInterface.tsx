import { useEffect, useMemo, useState } from 'react'
import './dashboardInterface.css'

type Recruit = {
  name: string
  date: string
  years: string
  initials: string
}

type Pill = {
  value: string
  label: string
  tone: 'blue' | 'green' | 'red' | 'lavender' | 'orange' | 'yellow'
}

const recruits: Recruit[] = [
  { name: 'Andrianjafy', date: '28 décembre 2024', years: '1 an', initials: 'A' },
  { name: 'Cédric Tantely', date: '28 janvier 2024', years: '1 an', initials: 'C' },
  { name: 'Super', date: '1 janvier 2024', years: '1 an', initials: 'S' },
  { name: 'Kely', date: '28 mars 2023', years: '2 ans', initials: 'K' },
  { name: 'Doe', date: '28 décembre 2022', years: '3 ans', initials: 'D' },
  { name: 'Hank', date: '14 janvier 2022', years: '3 ans', initials: 'H' },
]

const veterans: Recruit[] = [
  { name: 'Clément', date: '28 décembre 2021', years: '4 ans', initials: 'C' },
  { name: 'Hank', date: '14 janvier 2022', years: '3 ans', initials: 'H' },
  { name: 'Doe', date: '28 décembre 2022', years: '3 ans', initials: 'D' },
  { name: 'Kely', date: '28 mars 2023', years: '2 ans', initials: 'K' },
]

const staffSplit: Pill[] = [
  { value: '7', label: 'Employés', tone: 'lavender' },
  { value: '7', label: 'Actifs', tone: 'green' },
  { value: '0', label: 'Inactifs', tone: 'red' },
  { value: '4', label: 'Départements', tone: 'blue' },
  { value: '11', label: 'Postes', tone: 'orange' },
]

const missionSplit: Pill[] = [
  { value: '1', label: 'Total', tone: 'blue' },
  { value: '1', label: 'Effectuées', tone: 'green' },
  { value: '0', label: 'En cours', tone: 'yellow' },
  { value: '0', label: 'Ce mois', tone: 'orange' },
  { value: '1', label: 'Cette année', tone: 'lavender' },
]

const roleBars = [
  { title: 'Directeur adjoint', count: 0, height: 20 },
  { title: 'Professeur', count: 6, height: 68 },
  { title: 'Secrétaire', count: 9, height: 92 },
  { title: 'Comptable', count: 4, height: 50 },
  { title: 'Surveillant', count: 5, height: 62 },
  { title: 'CPE', count: 3, height: 42 },
  { title: 'Accueil', count: 2, height: 34 },
  { title: 'Entretien', count: 4, height: 48 },
]

export default function DashboardInterface() {
  const [modal, setModal] = useState<null | 'salary' | 'missions' | 'staff'>(null)
  const [closing, setClosing] = useState(false)

  const modalTitle = useMemo(() => {
    if (modal === 'salary') return 'Détail des salaires'
    if (modal === 'missions') return 'Détail du budget mission'
    if (modal === 'staff') return 'Détail de l’effectif'
    return ''
  }, [modal])

  const openModal = (target: 'salary' | 'missions' | 'staff') => {
    setClosing(false)
    setModal(target)
  }

  const closeModal = () => {
    setClosing(true)
  }

  useEffect(() => {
    if (!closing) return
    const timeout = window.setTimeout(() => {
      setModal(null)
      setClosing(false)
    }, 180)
    return () => window.clearTimeout(timeout)
  }, [closing])

  return (
    <div className="dashboard">
      <aside className="dashboard__left panel card-fade">
        <section className="card card--list">
          <div className="card__header">
            <h3>Nouvelles recrues</h3>
            <button type="button" className="icon-btn" aria-label="Nouvelles recrues">
              ⌂
            </button>
          </div>
          <ul className="people-list">
            {recruits.map((person) => (
              <li key={person.name} className="person">
                <span className="avatar">{person.initials}</span>
                <div className="person__meta">
                  <strong>{person.name}</strong>
                  <span>◷ {person.date}</span>
                </div>
                <small>{person.years}</small>
              </li>
            ))}
          </ul>
        </section>

        <section className="card card--dark card-fade delay-1">
          <h3>Avantages et primes</h3>
          <p className="money money--xl">14,000.00 Ar</p>
          <span className="month">Février 2025</span>
          <ul className="benefits">
            <li>
              <span>🏅 Assurance retraite</span>
              <strong>12,000.00 Ar</strong>
            </li>
            <li>
              <span>🥈 Heure supplémentaire</span>
              <strong>2,000.00 Ar</strong>
            </li>
          </ul>
        </section>
      </aside>

      <main className="dashboard__main">
        <header className="topbar card-fade">
          <strong>VAHATRA</strong>
          <div className="topbar__right">
            <span>Dashboard</span>
            <button className="icon-btn" type="button" aria-label="Menu">
              ☰
            </button>
            <button className="icon-btn" type="button" aria-label="Logout">
              ↪
            </button>
          </div>
        </header>

        <section className="stats card-fade delay-1">
          <article className="card tone-green clickable" onClick={() => openModal('salary')}>
            <div className="card__header">
              <h3>Salaire total</h3>
              <span>$</span>
            </div>
            <span className="month">Février 2025</span>
            <p className="money">8,621,258.00 Ar</p>
          </article>
          <article className="card tone-yellow">
            <div className="card__header">
              <h3>Salaire moyen</h3>
              <span>◔</span>
            </div>
            <span className="month">Février 2025</span>
            <p className="money">1,231,608.29 Ar</p>
          </article>
        </section>

        <section className="card section card-fade delay-2">
          <div className="card__header">
            <h3>Répartition de l'effectif</h3>
            <button className="icon-btn" type="button" onClick={() => openModal('staff')}>
              ⎘
            </button>
          </div>
          <div className="pill-grid">
            {staffSplit.map((item) => (
              <article key={item.label} className={`pill tone-${item.tone}`}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="card section card-fade delay-3">
          <h3>Répartition par poste</h3>
          <div className="role-chart">
            {roleBars.map((bar) => (
              <button key={bar.title} type="button" className="role-bar" title={`${bar.title}: ${bar.count}`}>
                <span style={{ height: `${bar.height}%` }} />
              </button>
            ))}
          </div>
          <div className="role-tooltip">
            <strong>Directeur adjoint</strong>
            <span>Nombre d'employés: 0</span>
          </div>
        </section>

        <section className="card section card-fade delay-4">
          <div className="card__header">
            <h3>Bilan des missions</h3>
            <span>◱</span>
          </div>
          <div className="pill-grid">
            {missionSplit.map((item) => (
              <article key={item.label} className={`pill tone-${item.tone}`}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </section>
      </main>

      <aside className="dashboard__right panel card-fade delay-2">
        <section className="card card--list">
          <div className="card__header">
            <h3>Les vétérans</h3>
            <button type="button" className="icon-btn" aria-label="Vétérans">
              ⚿
            </button>
          </div>
          <ul className="people-list">
            {veterans.map((person) => (
              <li key={person.name} className="person">
                <span className="avatar">{person.initials}</span>
                <div className="person__meta">
                  <strong>{person.name}</strong>
                  <span>◷ {person.date}</span>
                </div>
                <small>{person.years}</small>
              </li>
            ))}
          </ul>
        </section>

        <section className="card card--dark card-fade delay-3">
          <h3>Répartition par genre</h3>
          <div className="gender-row">
            <span className="avatar avatar--muted">H</span>
            <span>Hommes</span>
            <strong>5</strong>
          </div>
          <div className="gender-row">
            <span className="avatar avatar--muted">F</span>
            <span>Femmes</span>
            <strong>2</strong>
          </div>
        </section>

        <section className="card card-fade delay-4 clickable" onClick={() => openModal('missions')}>
          <h3>Budget pour les missions</h3>
          <p className="money">319,000.00 Ar</p>
          <span className="month">Janvier 2025</span>
          <ul className="budget-list">
            <li>
              <span>⌂ Indemnités</span>
              <strong>220,000.00 Ar</strong>
            </li>
            <li>
              <span>◉ Transports</span>
              <strong>99,000.00 Ar</strong>
            </li>
          </ul>
        </section>
      </aside>

      {modal && (
        <div className={`modal ${closing ? 'modal--closing' : ''}`} role="dialog" aria-modal="true">
          <div className="modal__backdrop" onClick={closeModal} />
          <section className={`modal__card ${closing ? 'modal__card--closing' : ''}`}>
            <div className="card__header">
              <h3>{modalTitle}</h3>
              <button className="icon-btn" type="button" onClick={closeModal}>
                ✕
              </button>
            </div>
            {modal === 'salary' && <p>Le salaire total inclut les primes et missions validées du mois.</p>}
            {modal === 'missions' && <p>Le budget mission se répartit entre indemnités et transports.</p>}
            {modal === 'staff' && <p>L’établissement compte 7 employés actifs répartis sur 11 postes.</p>}
          </section>
        </div>
      )}
    </div>
  )
}