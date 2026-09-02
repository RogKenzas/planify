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

const parseJson = async <T>(res: Response) => {
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.message || 'Erreur API')
  }
  return data as T
}

export const getTeachers = async () => {
  const res = await fetch('/api/teachers')
  return parseJson<Teacher[]>(res)
}

export const createTeacher = async (payload: { name: string; subject: string }) => {
  const res = await fetch('https://backend-planify-jsk6.onrender.com/api/teachers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseJson<Teacher>(res)
}

export const getCourses = async () => {
  const res = await fetch('https://backend-planify-jsk6.onrender.com/api/schedule/data')
  return parseJson<Course[]>(res)
}

export const createCourse = async (payload: Omit<Course, 'id'>) => {
  const res = await fetch('https://backend-planify-jsk6.onrender.com/api/schedule/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseJson<Course>(res)
}

export const updateCourse = async (id: string, payload: Omit<Course, 'id'>) => {
  const res = await fetch(`https://backend-planify-jsk6.onrender.com/api/schedule/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseJson<Course>(res)
}
