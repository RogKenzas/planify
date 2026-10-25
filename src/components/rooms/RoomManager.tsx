import { Building2, Users } from 'lucide-react'
import type { Room } from '../../api/rooms'

type RoomManagerProps = {
  rooms: Room[]
  selectedRoomId: string | null
  onSelectRoom: (room: Room) => void
  onCreateRoom: () => void
}

export default function RoomManager({
  rooms,
  selectedRoomId,
  onSelectRoom,
  onCreateRoom,
}: RoomManagerProps) {

  const roomsByBuilding = rooms.reduce<
    Record<string, Room[]>
  >((groups, room) => {

    const building =
      room.building?.trim() || 'Autre'

    if (!groups[building]) {
      groups[building] = []
    }

    groups[building].push(room)

    return groups
  }, {})

  const buildings =
    Object.keys(roomsByBuilding).sort()

  return (
    <section className="room-manager">

      {/* HEADER */}

      <div className="room-manager-header">

        <div>
          <p className="card-sub">
            Organisation physique
          </p>

          <h2>
            Gestion des salles
          </h2>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={onCreateRoom}
        >
          + Nouvelle salle
        </button>

      </div>

      {/* CONTENU */}

      <div className="room-manager-content">

        {rooms.length === 0 ? (

          <div className="room-manager-empty">
            <Building2 size={22} />

            <span>
              Aucune salle physique disponible.
            </span>
          </div>

        ) : (

          buildings.map((building) => (

            <div
              key={building}
              className="room-building-group"
            >

              {/* BLOC */}

              <div className="room-building-header">

                <div className="room-building-title">
                  <Building2 size={14} />

                  <strong>
                    Bloc {building}
                  </strong>
                </div>

                <span className="room-building-count">
                  {roomsByBuilding[building].length}
                </span>

              </div>

              {/* SALLES */}

              <div className="room-tiles">

                {roomsByBuilding[building].map(
                  (room) => {

                    const isSelected =
                      selectedRoomId === room.id

                    return (
                      <button
                        key={room.id}
                        type="button"
                        className={`room-tile ${
                          isSelected
                            ? 'room-tile-selected'
                            : ''
                        }`}
                        onClick={() =>
                          onSelectRoom(room)
                        }
                      >

                        <div className="room-tile-icon">
                          <Building2 size={16} />
                        </div>

                        <div className="room-tile-info">

                          <strong>
                            {room.name}
                          </strong>

                          <span>
                            Bloc {room.building}
                          </span>

                          {room.capacity && (
                            <span>
                              <Users size={11} />

                              {room.capacity} places
                            </span>
                          )}

                        </div>

                      </button>
                    )
                  }
                )}

              </div>

            </div>

          ))

        )}

      </div>

    </section>
  )
}