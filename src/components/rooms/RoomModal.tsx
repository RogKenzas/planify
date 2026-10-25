import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import type {
  Room,
  RoomPayload,
} from '../../api/rooms'

type RoomModalProps = {
  open: boolean
  room?: Room | null
  loading?: boolean
  error?: string

  onClose: () => void
  onSubmit: (payload: RoomPayload) => Promise<void>
}

export default function RoomModal({
  open,
  room = null,
  loading = false,
  error = '',
  onClose,
  onSubmit,
}: RoomModalProps) {

  const [name, setName] = useState('')
  const [building, setBuilding] =
    useState<'A' | 'G'>('A')

  const [capacity, setCapacity] = useState('')
  const [type, setType] =
    useState<RoomPayload['type']>('classroom')

  const isEditing = room !== null

  useEffect(() => {
    if (!open) {
      return
    }

    if (room) {
      setName(room.name)

      setBuilding(
        room.building === 'G'
          ? 'G'
          : 'A'
      )

      setCapacity(
        room.capacity
          ? String(room.capacity)
          : ''
      )

      setType(
        room.type ?? 'classroom'
      )

    } else {
      setName('')
      setBuilding('A')
      setCapacity('')
      setType('classroom')
    }

  }, [open, room])

  if (!open) {
    return null
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const cleanName = name.trim()

    if (!cleanName) {
      return
    }

    const parsedCapacity =
      capacity.trim()
        ? Number(capacity)
        : undefined

    if (
      parsedCapacity !== undefined &&
      (
        !Number.isInteger(parsedCapacity) ||
        parsedCapacity <= 0
      )
    ) {
      return
    }

    await onSubmit({
      name: cleanName,
      building,
      capacity: parsedCapacity,
      type,
    })
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          onClose()
        }
      }}
    >
      <div className="modal-card room-modal">

        <div className="panel-header">

          <div>
            <p className="card-sub">
              Organisation physique
            </p>

            <h2>
              {isEditing
                ? 'Modifier la salle'
                : 'Nouvelle salle'}
            </h2>
          </div>

          <button
            type="button"
            className="classroom-modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Fermer"
          >
            <X size={17} />
          </button>

        </div>

        <form
          className="modal-form"
          onSubmit={handleSubmit}
        >

          <label className="classroom-form-group">
            <span>Nom de la salle</span>

            <input
              type="text"
              placeholder="Ex : G-203"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              disabled={loading}
              autoFocus
            />
          </label>

          <label className="classroom-form-group">
            <span>Bloc</span>

            <select
              value={building}
              onChange={(event) =>
                setBuilding(
                  event.target.value as 'A' | 'G'
                )
              }
              disabled={loading}
            >
              <option value="A">
                Bloc A
              </option>

              <option value="G">
                Bloc G
              </option>
            </select>
          </label>

          <label className="classroom-form-group">
            <span>Capacité</span>

            <input
              type="number"
              min="1"
              step="1"
              placeholder="Ex : 30"
              value={capacity}
              onChange={(event) =>
                setCapacity(event.target.value)
              }
              disabled={loading}
            />
          </label>

          <label className="classroom-form-group">
            <span>Type de salle</span>

            <select
              value={type}
              onChange={(event) =>
                setType(
                  event.target
                    .value as RoomPayload['type']
                )
              }
              disabled={loading}
            >
              <option value="classroom">
                Salle de cours
              </option>

              <option value="lab">
                Laboratoire
              </option>

              <option value="amphitheater">
                Amphithéâtre
              </option>
            </select>
          </label>

          {error && (
            <p className="classroom-form-error">
              {error}
            </p>
          )}

          <div className="classroom-modal-actions">

            <button
              type="button"
              className="ghost-btn"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={
                loading ||
                !name.trim() ||
                (
                  capacity !== '' &&
                  (
                    !Number.isInteger(Number(capacity)) ||
                    Number(capacity) <= 0
                  )
                )
              }
            >
              {loading
                ? 'Enregistrement...'
                : isEditing
                  ? 'Enregistrer'
                  : 'Créer la salle'}
            </button>

          </div>

        </form>

      </div>
    </div>
  )
}