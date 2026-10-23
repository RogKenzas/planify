import { useState } from 'react'
import {
  ArrowRight,
  EllipsisVertical,
  Pencil,
  Trash2,
} from 'lucide-react'

import type { Classroom } from '../../api/classrooms'

type ClassroomCardProps = {
  classroom: Classroom
  isActive: boolean

  onSelect: (classroom: Classroom) => void
  onEdit: (classroom: Classroom) => void
  onDelete: (classroom: Classroom) => void
}

export default function ClassroomCard({
  classroom,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}: ClassroomCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <article
      className={`classroom-row ${
        isActive ? 'classroom-row-active' : ''
      }`}
      onClick={() => onSelect(classroom)}
    >
      {/* Menu trois points */}
      <div className="classroom-row-menu-wrapper">
        <button
          type="button"
          className="classroom-row-menu"
          aria-label={`Actions pour ${classroom.name}`}
          onClick={(event) => {
            event.stopPropagation()
            setMenuOpen((current) => !current)
          }}
        >
          <EllipsisVertical size={18} />
        </button>

        {menuOpen && (
          <div
            className="classroom-row-dropdown"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                onEdit(classroom)
              }}
            >
              <Pencil size={14} />
              Modifier
            </button>

            <button
              type="button"
              className="classroom-row-delete"
              onClick={() => {
                setMenuOpen(false)
                onDelete(classroom)
              }}
            >
              <Trash2 size={14} />
              Supprimer
            </button>
          </div>
        )}
      </div>

      {/* Informations */}
      <div className="classroom-row-content">
        <h3>{classroom.name}</h3>

        <p>
          {classroom.teacher
            ? classroom.teacher.name
            : 'Aucun professeur titulaire'}
        </p>
      </div>

      {/* Sélection de la salle */}
      <div className="classroom-row-arrow">
        <ArrowRight size={16} />
      </div>
    </article>
  )
}