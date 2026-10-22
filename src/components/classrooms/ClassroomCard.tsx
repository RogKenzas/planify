import {
  EllipsisVertical,
  GraduationCap,
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

  return (
    <article
      className={`classroom-card ${isActive ? 'classroom-card-active' : ''}`}
      onClick={() => onSelect(classroom)}
    >

      {/* Partie supérieure */}
      <div className="classroom-card-header">

        <div className="classroom-icon">
          <GraduationCap size={18} />
        </div>

        <div className="classroom-actions">

          <button
            type="button"
            className="classroom-menu-button"
            aria-label={`Actions pour ${classroom.name}`}
            onClick={(event) => {
              event.stopPropagation()

              const menu = event.currentTarget
                .nextElementSibling as HTMLElement | null

              menu?.classList.toggle('classroom-action-menu-open')
            }}
          >
            <EllipsisVertical size={17} />
          </button>


          <div className="classroom-action-menu">

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onEdit(classroom)
              }}
            >
              <Pencil size={14} />

              Modifier
            </button>


            <button
              type="button"
              className="delete-action"
              onClick={(event) => {
                event.stopPropagation()
                onDelete(classroom)
              }}
            >
              <Trash2 size={14} />

              Supprimer
            </button>

          </div>

        </div>

      </div>


      {/* Nom de la salle */}
      <div className="classroom-card-content">

        <h3>{classroom.name}</h3>

        <p className="classroom-label">
          Professeur titulaire
        </p>


        {classroom.teacher ? (
          <>
            <p className="classroom-teacher-name">
              {classroom.teacher.name}
            </p>

            <p className="card-sub">
              {classroom.teacher.subject}
            </p>
          </>
        ) : (
          <p className="card-sub">
            Aucun professeur affecté
          </p>
        )}

      </div>


      {/* Indication de sélection */}
      <div className="classroom-card-footer">

        {isActive ? (
          <span className="classroom-selected-badge">
            Salle sélectionnée
          </span>
        ) : (
          <span className="classroom-open-label">
            Voir l'emploi du temps
          </span>
        )}

      </div>

    </article>
  )
}