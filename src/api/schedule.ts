export type Teacher = {
  id: string
  name: string
  subject: string
  initials: string
}

export type CourseClassroom = {
  id: string
  name: string
}

export type Course = {
  id: string
  _id?: string
  title: string
  teacherId: string
  classroomId: string
  classroom?: CourseClassroom | null
  duration: string
  color: 'blue' | 'green' | 'purple' | 'yellow'
}

export type ScheduleSlot = {
  id: string
  classroomId: string
  courseId: string
  day: string
  time: string

  course: Course | null

  createdAt?: string
  updatedAt?: string
}

export type CoursePayload = {
  title: string
  teacherId: string
  classroomId: string
  duration: string
  color: Course['color']
}

const API_BASE = 'https://backend-planify-jsk6.onrender.com'

const parseJson = async <T>(res: Response) => {
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.message || 'Erreur API')
  }
  return data as T
}

const asArray = <T>(data: T[] | { value?: T[] } | null | undefined): T[] => {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.value)) return data.value
  return []
}

export const getTeachers = async () => {
  const res = await fetch(`${API_BASE}/api/teachers`)
  const data = await parseJson<Teacher[] | { value?: Teacher[] }>(res)
  return asArray(data)
}

export const createTeacher = async (payload: { name: string; subject: string }) => {
  const res = await fetch(`${API_BASE}/api/teachers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseJson<Teacher>(res)
}

export const getCourses = async () => {
  const res = await fetch(`${API_BASE}/api/courses`)

  const data = await parseJson<
    Course[] | { value?: Course[] }
  >(res)

  const courses = asArray(data)

  return courses.map((course) => ({
    ...course,
    id: course.id ?? course._id ?? '',
  }))
}

export const createCourse = async (
  payload: CoursePayload
) => {
  const res = await fetch(
    `${API_BASE}/api/courses`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  )

  return parseJson<Course>(res)
}

export const updateCourse = async (
  id: string,
  payload: CoursePayload
) => {
  const res = await fetch(
    `${API_BASE}/api/courses/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  return parseJson<Course>(res)
}

/**
 * Charge l'emploi du temps d'une salle.
 */
export const getClassroomSchedule = async (
  classroomId: string
) => {
  const res = await fetch(
    `${API_BASE}/api/schedule/classroom/${classroomId}`
  )

  const data = await parseJson<
    ScheduleSlot[] | { value?: ScheduleSlot[] }
  >(res)

  return asArray(data)
}


/**
 * Ajoute ou remplace un cours dans un créneau.
 *
 * Si le créneau existe déjà pour :
 * classroomId + day + time
 *
 * le backend le remplace.
 */
export const upsertScheduleSlot = async (
  classroomId: string,
  payload: {
    courseId: string
    day: string
    time: string
  }
) => {
  const res = await fetch(
    `${API_BASE}/api/schedule/classroom/${classroomId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  return parseJson<ScheduleSlot>(res)
}


/**
 * Supprime un cours du planning.
 */
export const deleteScheduleSlot = async (
  classroomId: string,
  slotId: string
) => {
  const res = await fetch(
    `${API_BASE}/api/schedule/classroom/${classroomId}/${slotId}`,
    {
      method: 'DELETE',
    }
  )

  return parseJson<{
    message: string
    id?: string
  }>(res)
}