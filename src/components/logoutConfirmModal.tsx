import './sharedModal.css'

type Props = {
  open: boolean
  username: string
  onCancel: () => void
  onConfirm: () => void
}

export default function LogoutConfirmModal({ open, username, onCancel, onConfirm }: Props) {
  if (!open) return null

  return (
    <div className="modal-overlay modal-overlay--top" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="card-sub">Session active</p>
        <h3>Se déconnecter ?</h3>
        <p className="modal-copy">
          {username}, voulez-vous vraiment vous déconnecter de Planify ?
        </p>
        <div className="action-row">
          <button type="button" className="ghost-btn" onClick={onCancel}>Rester connecté</button>
          <button type="button" className="danger-btn" onClick={onConfirm}>Se déconnecter</button>
        </div>
      </div>
    </div>
  )
}
