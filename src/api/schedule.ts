export type Teacher = {
  id: string
  name: string
  subject: string
  initials: string
}

export type Course = {
  id: string
  title: string
  teacherId: string
  room: string
  duration: string
  color: 'blue' | 'green' | 'purple' | 'yellow'
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
  const res = await fetch(`${API_BASE}/api/schedule/data`)
  const data = await parseJson<Course[] | { value?: Course[] }>(res)
  return asArray(data)
}

export const createCourse = async (payload: Omit<Course, 'id'>) => {
  const res = await fetch(`${API_BASE}/api/schedule/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseJson<Course>(res)
}

export const updateCourse = async (id: string, payload: Omit<Course, 'id'>) => {
  const res = await fetch(`${API_BASE}/api/schedule/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseJson<Course>(res)
}
