import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import type { Teacher } from '../../api/schedule'
import type {
  Classroom,
  ClassroomPayload,
} from '../../api/classrooms'


type ClassroomModalProps = {
  open: boolean

  classroom: Classroom | null

  teachers: Teacher[]

  loading?: boolean

  error?: string

  onClose: () => void

  onSubmit: (payload: ClassroomPayload) => Promise<void>
}


export default function ClassroomModal({
  open,
  classroom,
  teachers,
  loading = false,
  error = '',
  onClose,
  onSubmit,
}: ClassroomModalProps) {

  const [name, setName] = useState('')
  const [teacherId, setTeacherId] = useState('')


  /*
   * classroom !== null
   * => mode modification
   *
   * classroom === null
   * => mode création
   */
  const isEditing = classroom !== null


  /*
   * À chaque ouverture de la modale,
   * on initialise correctement le formulaire.
   */
  useEffect(() => {

    if (!open) {
      return
    }


    if (classroom) {

      setName(classroom.name)

      setTeacherId(classroom.teacherId)

    } else {

      setName('')

      setTeacherId('')

    }

  }, [open, classroom])


  /*
   * Si la modale n'est pas ouverte,
   * le composant n'affiche rien.
   */
  if (!open) {
    return null
  }


  /*
   * Envoi du formulaire.
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()


    const cleanName = name.trim()


    if (!cleanName || !teacherId) {
      return
    }


    await onSubmit({
      name: cleanName,
      teacherId,
    })
  }


  return (

    <div
      className="modal-overlay"
      onMouseDown={(event) => {

        /*
         * Si l'utilisateur clique directement
         * sur l'arrière-plan, on ferme la modale.
         */
        if (event.target === event.currentTarget && !loading) {
          onClose()
        }

      }}
    >

      <div className="modal-card classroom-modal">

        {/* ================================= */}
        {/* HEADER                            */}
        {/* ================================= */}

        <div className="panel-header">

          <div>

            <p className="card-sub">
              Gestion des classes
            </p>

            <h2>
              {isEditing
                ? 'Modifier la classe'
                : 'Nouvelle classe'}
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


        {/* ================================= */}
        {/* FORMULAIRE                        */}
        {/* ================================= */}

        <form
          className="modal-form"
          onSubmit={handleSubmit}
        >

          {/* Nom de la classe */}

          <label className="classroom-form-group">

            <span>
              Nom de la classe
            </span>

            <input
              type="text"
              placeholder="Ex : 4DS1"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              disabled={loading}
              autoFocus
            />

          </label>


          {/* Professeur titulaire */}

          <label className="classroom-form-group">

            <span>
              Professeur titulaire
            </span>

            <select
              value={teacherId}
              onChange={(event) =>
                setTeacherId(event.target.value)
              }
              disabled={loading}
            >

              <option value="">
                Sélectionner un professeur
              </option>


              {teachers.map((teacher) => (

                <option
                  key={teacher.id}
                  value={teacher.id}
                >
                  {teacher.name} - {teacher.subject}
                </option>

              ))}

            </select>

          </label>


          {/* Message si aucun professeur */}

          {teachers.length === 0 && (

            <p className="classroom-form-warning">

              Aucun professeur disponible.
              Ajoute d'abord un professeur.

            </p>

          )}


          {/* Erreur API */}

          {error && (

            <p className="classroom-form-error">
              {error}
            </p>

          )}


          {/* ================================= */}
          {/* ACTIONS                           */}
          {/* ================================= */}

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
                !teacherId
              }
            >

              {loading
                ? 'Enregistrement...'
                : isEditing
                  ? 'Enregistrer'
                  : 'Créer la classe'}

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}