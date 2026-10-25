import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'

import { createClassroom, deleteClassroom, getClassrooms, updateClassroom, type Classroom, type ClassroomPayload } from '../../api/classrooms'

import type { Teacher } from '../../api/schedule'

import ClassroomCard from './ClassroomCard'
import ClassroomModal from './ClassroomModal'


type ClassroomManagerProps = {
  teachers: Teacher[]

  selectedClassroomId: string | null

  onSelectClassroom: (classroom: Classroom) => void
}


export default function ClassroomManager({
  teachers,
  selectedClassroomId,
  onSelectClassroom,
}: ClassroomManagerProps) {

  /*
   * Liste des salles provenant du backend.
   */
  const [classrooms, setClassrooms] = useState<Classroom[]>([])


  /*
   * État de chargement initial.
   */
  const [loading, setLoading] = useState(true)


  /*
   * Chargement pendant POST / PUT.
   */
  const [saving, setSaving] = useState(false)


  /*
   * Erreur générale.
   */
  const [error, setError] = useState('')


  /*
   * Ouverture de la modale création/modification.
   */
  const [showModal, setShowModal] = useState(false)


  /*
   * null = création
   * Classroom = modification
   */
  const [classroomToEdit, setClassroomToEdit] =
    useState<Classroom | null>(null)


  /*
   * Salle en attente de suppression.
   */
  const [classroomToDelete, setClassroomToDelete] =
    useState<Classroom | null>(null)


  /*
   * État du bouton de suppression.
   */
  const [deleting, setDeleting] = useState(false)


  /* ========================================= */
  /* CHARGEMENT DES SALLES                     */
  /* ========================================= */

  useEffect(() => {

    const loadClassrooms = async () => {

      setLoading(true)
      setError('')

      try {

        const data = await getClassrooms()

        setClassrooms(data)

      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de charger les classes'
        )

      } finally {

        setLoading(false)

      }

    }


    void loadClassrooms()

  }, [])


  /* ========================================= */
  /* OUVRIR CRÉATION                           */
  /* ========================================= */

  const openCreateModal = () => {

    setError('')

    setClassroomToEdit(null)

    setShowModal(true)
  }


  /* ========================================= */
  /* OUVRIR MODIFICATION                       */
  /* ========================================= */

  const openEditModal = (classroom: Classroom) => {

    setError('')

    setClassroomToEdit(classroom)

    setShowModal(true)
  }


  /* ========================================= */
  /* FERMER MODALE                             */
  /* ========================================= */

  const closeModal = () => {

    if (saving) {
      return
    }

    setShowModal(false)

    setClassroomToEdit(null)

    setError('')
  }


  /* ========================================= */
  /* CREATE / UPDATE                           */
  /* ========================================= */

  const handleSubmit = async (
    payload: ClassroomPayload
  ) => {

    setSaving(true)
    setError('')


    try {

      /*
       * MODE MODIFICATION
       */
      if (classroomToEdit) {

        const updatedClassroom =
          await updateClassroom(
            classroomToEdit.id,
            payload
          )


        setClassrooms((previous) =>
          previous.map((classroom) =>
            classroom.id === updatedClassroom.id
              ? updatedClassroom
              : classroom
          )
        )


        /*
         * Si la salle modifiée est actuellement
         * sélectionnée, on transmet également
         * sa nouvelle version au Dashboard.
         */
        if (
          selectedClassroomId ===
          updatedClassroom.id
        ) {

          onSelectClassroom(updatedClassroom)

        }

      } else {

        /*
         * MODE CRÉATION
         */

        const newClassroom =
          await createClassroom(payload)


        setClassrooms((previous) => [
          newClassroom,
          ...previous,
        ])

      }


      setShowModal(false)

      setClassroomToEdit(null)


    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer la classe"
      )

    } finally {

      setSaving(false)

    }

  }


  /* ========================================= */
  /* DEMANDER SUPPRESSION                      */
  /* ========================================= */

  const requestDelete = (
    classroom: Classroom
  ) => {

    setError('')

    setClassroomToDelete(classroom)

  }


  /* ========================================= */
  /* CONFIRMER SUPPRESSION                     */
  /* ========================================= */

  const confirmDelete = async () => {

    if (!classroomToDelete) {
      return
    }


    setDeleting(true)
    setError('')


    try {

      const classroomId =
        classroomToDelete.id


      await deleteClassroom(classroomId)


      setClassrooms((previous) =>
        previous.filter(
          (classroom) =>
            classroom.id !== classroomId
        )
      )


      setClassroomToDelete(null)


    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de supprimer la classe'
      )

    } finally {

      setDeleting(false)

    }

  }


  /* ========================================= */
  /* RENDU                                     */
  /* ========================================= */

  return (

    <section className="classroom-manager">

      {/* ===================================== */}
      {/* HEADER                                */}
      {/* ===================================== */}

      <div className="classroom-manager-header">

        <div>

          <p className="card-sub">
            Organisation académique
          </p>

          <h2>
            Gestion des Classes
          </h2>

        </div>


        <button
          type="button"
          className="primary-btn"
          onClick={openCreateModal}
        >

          <Plus size={14} />

          Nouvelle classe

        </button>

      </div>


      {/* ===================================== */}
      {/* ERREUR GÉNÉRALE                       */}
      {/* ===================================== */}

      {error && !showModal && (

        <div className="classroom-manager-error">
          {error}
        </div>

      )}


      {/* ===================================== */}
      {/* CHARGEMENT                            */}
      {/* ===================================== */}

      {loading ? (

        <div className="classroom-manager-empty">

          <p className="card-sub">
            Chargement des classes...
          </p>

        </div>

      ) : classrooms.length === 0 ? (

        /* =================================== */
        /* AUCUNE SALLE                        */
        /* =================================== */

        <div className="classroom-manager-empty">
          <p className="text__empty">Aucune classe enregistrée</p>
        </div>

      ) : (

        /* =================================== */
        /* LISTE DES SALLES                    */
        /* =================================== */

        <div className="classroom-grid">

          {classrooms.map((classroom) => (

            <ClassroomCard
              key={classroom.id}

              classroom={classroom}

              isActive={
                classroom.id ===
                selectedClassroomId
              }

              onSelect={onSelectClassroom}

              onEdit={openEditModal}

              onDelete={requestDelete}
            />

          ))}

        </div>

      )}


      {/* ===================================== */}
      {/* MODALE CREATE / UPDATE                */}
      {/* ===================================== */}

      <ClassroomModal
        open={showModal}

        classroom={classroomToEdit}

        teachers={teachers}

        loading={saving}

        error={showModal ? error : ''}

        onClose={closeModal}

        onSubmit={handleSubmit}
      />


      {/* ===================================== */}
      {/* MODALE DELETE                         */}
      {/* ===================================== */}

      {classroomToDelete && (

        <div className="modal-overlay">

          <div className="modal-card">

            <div className="panel-header">

              <div>

                <p className="card-sub">
                  Gestion des classes
                </p>

                <h2>
                  Supprimer la classe
                </h2>

              </div>

            </div>


            <div className="classroom-delete-content">

              <p>

                Veux-tu vraiment supprimer la classe{' '}

                <strong>
                  {classroomToDelete.name}
                </strong>

                {' '}?

              </p>


              <p className="card-sub">

                Cette action supprimera la salle
                de Planify.

              </p>

            </div>


            <div className="classroom-modal-actions">

              <button
                type="button"
                className="ghost-btn"

                disabled={deleting}

                onClick={() =>
                  setClassroomToDelete(null)
                }
              >
                Annuler
              </button>


              <button
                type="button"
                className="danger-btn"

                disabled={deleting}

                onClick={() =>
                  void confirmDelete()
                }
              >

                {deleting
                  ? 'Suppression...'
                  : 'Supprimer'}

              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  )
}