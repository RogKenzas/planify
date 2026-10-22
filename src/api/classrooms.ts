export type ClassroomTeacher = {
  id: string
  name: string
  subject: string
}

export type Classroom = {
  id: string
  name: string
  teacherId: string
  teacher: ClassroomTeacher | null
  createdAt?: string
  updatedAt?: string
}

export type ClassroomPayload = {
  name: string
  teacherId: string
}

const API_BASE = 'https://backend-planify-jsk6.onrender.com'


const parseJson = async <T>(res: Response): Promise<T> => {
  const data = await res.json()

  if (!res.ok) {
    throw new Error(
      data?.message || 'Une erreur est survenue avec les salles'
    )
  }

  return data as T
}


/**
 * Récupérer toutes les salles
 */
export const getClassrooms = async (): Promise<Classroom[]> => {
  const res = await fetch(`${API_BASE}/api/classrooms`)

  return parseJson<Classroom[]>(res)
}


/**
 * Récupérer une salle
 */
export const getClassroomById = async (
  id: string
): Promise<Classroom> => {
  const res = await fetch(
    `${API_BASE}/api/classrooms/${id}`
  )

  return parseJson<Classroom>(res)
}


/**
 * Créer une salle
 */
export const createClassroom = async (
  payload: ClassroomPayload
): Promise<Classroom> => {
  const res = await fetch(
    `${API_BASE}/api/classrooms`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(payload),
    }
  )

  return parseJson<Classroom>(res)
}


/**
 * Modifier une salle
 */
export const updateClassroom = async (
  id: string,
  payload: ClassroomPayload
): Promise<Classroom> => {
  const res = await fetch(
    `${API_BASE}/api/classrooms/${id}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(payload),
    }
  )

  return parseJson<Classroom>(res)
}


/**
 * Supprimer une salle
 */
export const deleteClassroom = async (
  id: string
): Promise<{ message: string; id: string }> => {
  const res = await fetch(
    `${API_BASE}/api/classrooms/${id}`,
    {
      method: 'DELETE',
    }
  )

  return parseJson<{
    message: string
    id: string
  }>(res)
}