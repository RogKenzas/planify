import './emptyPage.css'

type Props = {
  title: string
  subtitle?: string
}

export default function EmptyPage({ title, subtitle = 'Cette interface sera bientôt disponible.' }: Props) {
  return (
    <main className="placeholder-page">
      <section className="placeholder-card fade-in-up">
        <p className="card-sub">Espace Planify</p>
        <h1>{title}</h1>
        <p className="card-sub">{subtitle}</p>
      </section>
    </main>
  )
}
