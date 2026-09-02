import { useEffect, useMemo, useState } from 'react'
import { createCourse, createTeacher, getCourses, getTeachers, updateCourse, type Course, type Teacher } from '../api/schedule'
import LeftSideBar from '../components/leftSideBar'
import TopSideBar from '../components/topSideBar'
import './dashboardInterface.css'

type Reminder = {
    id: string
    title: string
    due: string
    priority: 'haute' | 'moyenne' | 'basse'
}

type ScheduleEntry = {
    id: string
    day: string
    time: string
    courseId: string
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
const TIMES = ['08:00', '10:00', '13:00', '15:00']

const PRIORITY_CLASS: Record<Reminder['priority'], string> = {
    haute: 'danger',
    moyenne: 'warning',
    basse: 'ok',
}

const CARD_COLORS: Record<Course['color'], string> = {
    blue: 'course-blue',
    green: 'course-green',
    purple: 'course-purple',
    yellow: 'course-yellow',
}

export default function DashboardInterface() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [showTeacherModal, setShowTeacherModal] = useState(false)
    const [showCourseModal, setShowCourseModal] = useState(false)
    const [draggedCourseId, setDraggedCourseId] = useState<string | null>(null)

    const [reminders] = useState<Reminder[]>([
        { id: 'r1', title: 'Réunion parents/professeurs', due: 'Aujourd’hui - 16:30', priority: 'haute' },
        { id: 'r2', title: 'Valider les emplois du temps', due: 'Demain - 11:00', priority: 'moyenne' },
        { id: 'r3', title: 'Contrôle qualité planning', due: 'Vendredi - 09:30', priority: 'basse' },
    ])

    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [courses, setCourses] = useState<Course[]>([])
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
    const [formError, setFormError] = useState('')
    const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null)
    const [slotMode, setSlotMode] = useState<'actions' | 'edit'>('actions')

    const [teacherForm, setTeacherForm] = useState({ name: '', subject: '' })
    const [courseForm, setCourseForm] = useState({
        title: '',
        room: '',
        duration: '2h',
        teacherId: '',
        color: 'blue' as Course['color'],
    })

    useEffect(() => {
        const loadPlanningData = async () => {
            const [teacherResult, courseResult] = await Promise.allSettled([getTeachers(), getCourses()])
            setTeachers(teacherResult.status === 'fulfilled' ? teacherResult.value : [])
            setCourses(courseResult.status === 'fulfilled' ? courseResult.value : [])
        }

        void loadPlanningData()
    }, [])

    const coursesByToday = useMemo(() => {
        const today = 'Lundi'
        return schedule
            .filter((entry) => entry.day === today)
            .map((entry) => {
                const course = courses.find((c) => c.id === entry.courseId)
                if (!course) return null
                const teacher = teachers.find((t) => t.id === course.teacherId)
                return { ...entry, course, teacher }
            })
            .filter(Boolean) as Array<{
                id: string
                day: string
                time: string
                course: Course
                teacher?: Teacher
            }>
    }, [schedule, courses, teachers])

    const totalPlanned = schedule.length
    const activeTeachers = teachers.length

    const onDropCourse = (day: string, time: string) => {
        if (!draggedCourseId) return
        setSchedule((prev) => {
            const existing = prev.find((slot) => slot.day === day && slot.time === time)
            if (existing) {
                return prev.map((slot) => (slot.id === existing.id ? { ...slot, courseId: draggedCourseId } : slot))
            }
            return [...prev, { id: `s${Date.now()}`, day, time, courseId: draggedCourseId }]
        })
    }

    const getSlotCourse = (day: string, time: string) => {
        const slot = schedule.find((entry) => entry.day === day && entry.time === time)
        if (!slot) return null
        return courses.find((course) => course.id === slot.courseId) ?? null
    }

    const selectedSlotCourse = selectedSlot ? getSlotCourse(selectedSlot.day, selectedSlot.time) : null

    const openSlotActions = (day: string, time: string) => {
        const course = getSlotCourse(day, time)
        if (!course) return
        setFormError('')
        setSelectedSlot({ day, time })
        setSlotMode('actions')
        setCourseForm({
            title: course.title,
            room: course.room,
            duration: course.duration,
            teacherId: course.teacherId,
            color: course.color,
        })
    }

    const closeSlotModal = () => {
        setSelectedSlot(null)
        setSlotMode('actions')
        setFormError('')
        setCourseForm({ title: '', room: '', duration: '2h', teacherId: '', color: 'blue' })
    }

    const removeSlotCourse = () => {
        if (!selectedSlot) return
        setSchedule((prev) => prev.filter((entry) => !(entry.day === selectedSlot.day && entry.time === selectedSlot.time)))
        closeSlotModal()
    }

    const saveSlotCourse = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedSlotCourse || !courseForm.title || !courseForm.room || !courseForm.teacherId) return
        setFormError('')
        try {
            const course = await updateCourse(selectedSlotCourse.id, courseForm)
            setCourses((prev) => prev.map((item) => (item.id === course.id ? course : item)))
            closeSlotModal()
        } catch (error) {
            setFormError(error instanceof Error ? error.message : 'Impossible de modifier le cours')
        }
    }

    const submitTeacher = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!teacherForm.name || !teacherForm.subject) return
        setFormError('')
        try {
            const teacher = await createTeacher(teacherForm)
            setTeachers((prev) => [teacher, ...prev])
            setTeacherForm({ name: '', subject: '' })
            setShowTeacherModal(false)
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "Impossible d'enregistrer le professeur")
        }
    }

    const submitCourse = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!courseForm.title || !courseForm.room || !courseForm.teacherId) return
        setFormError('')
        try {
            const course = await createCourse(courseForm)
            setCourses((prev) => [course, ...prev])
            setCourseForm({ title: '', room: '', duration: '2h', teacherId: '', color: 'blue' })
            setShowCourseModal(false)
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "Impossible d'enregistrer le cours")
        }
    }

    return (
        <div className="dashboard-interface-page">
            <TopSideBar onMenuClick={() => setIsMenuOpen(true)} />
            <LeftSideBar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <div className="school-dashboard">
                <aside className="dashboard-col dashboard-left fade-in">
                    <div className="panel-header">
                        <h2>Rappels</h2>
                        <button className="ghost-btn">Voir tout</button>
                    </div>
                    <div className="card-list">
                        {reminders.map((reminder) => (
                            <article key={reminder.id} className="soft-card reminder-card">
                                <div className={`priority-dot ${PRIORITY_CLASS[reminder.priority]}`} />
                                <div>
                                    <p className="card-title-sm">{reminder.title}</p>
                                    <p className="card-sub">{reminder.due}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </aside>

                <main className="dashboard-col dashboard-center fade-in-up">
                    <header className="dashboard-head">
                        <div>
                            <p className="card-sub">Système de gestion de planning scolaire</p>
                            <h1>Tableau de bord académique</h1>
                        </div>
                        <div className="action-row">
                            <button className="primary-btn" onClick={() => setShowCourseModal(true)}>+ Planifier un cours</button>
                            <button className="secondary-btn" onClick={() => setShowTeacherModal(true)}>+ Ajouter un professeur</button>
                        </div>
                    </header>

                    <section className="kpi-grid">
                        <article className="kpi-card green">
                            <p>Cours planifiés</p>
                            <h3>{totalPlanned}</h3>
                        </article>
                        <article className="kpi-card yellow">
                            <p>Professeurs actifs</p>
                            <h3>{activeTeachers}</h3>
                        </article>
                        <article className="kpi-card purple">
                            <p>Taux de couverture</p>
                            <h3>92%</h3>
                        </article>
                    </section>

                    <section className="soft-card timetable-card">
                        <div className="panel-header">
                            <h2>Emploi du temps hebdomadaire</h2>
                            <p className="card-sub">Glisse un cours, puis double-clique un créneau pour le modifier ou le retirer.</p>
                        </div>

                        <div className="timetable-grid">
                            <div className="corner-cell" />
                            {DAYS.map((day) => (
                                <div key={day} className="day-header">{day}</div>
                            ))}

                            {TIMES.map((time) => (
                                <div key={time} className="time-row">
                                    <div className="time-label">{time}</div>
                                    {DAYS.map((day) => {
                                        const slotCourse = getSlotCourse(day, time)
                                        return (
                                            <div
                                                key={`${day}-${time}`}
                                                className={`time-slot ${slotCourse ? `${CARD_COLORS[slotCourse.color]} filled-slot` : ''}`}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={() => onDropCourse(day, time)}
                                                onDoubleClick={() => openSlotActions(day, time)}
                                            >
                                                {slotCourse ? (
                                                    <>
                                                        <p className="card-title-sm">{slotCourse.title}</p>
                                                        <p className="card-sub">{slotCourse.room}</p>
                                                    </>
                                                ) : (
                                                    <p className="card-sub">Déposer ici</p>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <aside className="dashboard-col dashboard-right fade-in">
                    <div className="panel-header">
                        <h2>Cours du jour</h2>
                        <span className="badge">Lundi</span>
                    </div>
                    <div className="card-list">
                        {coursesByToday.map((item) => (
                            <article key={item.id} className={`soft-card course-pill ${CARD_COLORS[item.course.color]}`}>
                                <p className="card-title-sm">{item.time} - {item.course.title}</p>
                                <p className="card-sub">
                                    {item.teacher?.name ?? 'Professeur non affecté'} | {item.course.room}
                                </p>
                            </article>
                        ))}
                    </div>

                    <section className="soft-card">
                        <div className="panel-header">
                            <h2>Catalogue des cours</h2>
                            <p className="card-sub">Drag & drop</p>
                        </div>
                        <div className="card-list">
                            {courses.length === 0 ? (
                                <p className="empty-state">Aucun cours existant</p>
                            ) : (
                                courses.map((course) => {
                                    const teacher = teachers.find((t) => t.id === course.teacherId)
                                    return (
                                        <article
                                            key={course.id}
                                            draggable
                                            onDragStart={() => setDraggedCourseId(course.id)}
                                            className={`draggable-card ${CARD_COLORS[course.color]}`}
                                        >
                                            <p className="card-title-sm">{course.title}</p>
                                            <p className="card-sub">{teacher?.name ?? 'Non assigné'} - {course.duration}</p>
                                        </article>
                                    )
                                })
                            )}
                        </div>
                    </section>

                    <section className="soft-card teachers-card">
                        <div className="panel-header">
                            <h2>Professeurs</h2>
                            <span className="badge">{teachers.length}</span>
                        </div>
                        <div className="teacher-list">
                            {teachers.length === 0 ? (
                                <p className="empty-state">Aucun professeur existant</p>
                            ) : (
                                teachers.map((teacher) => (
                                    <div key={teacher.id} className="teacher-row">
                                        <span className="avatar">{teacher.initials}</span>
                                        <div>
                                            <p className="card-title-sm">{teacher.name}</p>
                                            <p className="card-sub">{teacher.subject}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </aside>
            </div>

            {showTeacherModal && (
                <div className="modal-overlay" onClick={() => { setShowTeacherModal(false); setFormError('') }}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h3>Ajouter un professeur</h3>
                        {formError ? <p className="empty-state">{formError}</p> : null}
                        <form onSubmit={submitTeacher} className="modal-form">
                            <input
                                type="text"
                                placeholder="Nom complet"
                                value={teacherForm.name}
                                onChange={(e) => setTeacherForm((prev) => ({ ...prev, name: e.target.value }))}
                            />
                            <input
                                type="text"
                                placeholder="Matière"
                                value={teacherForm.subject}
                                onChange={(e) => setTeacherForm((prev) => ({ ...prev, subject: e.target.value }))}
                            />
                            <div className="action-row">
                                <button type="button" className="ghost-btn" onClick={() => setShowTeacherModal(false)}>Annuler</button>
                                <button type="submit" className="primary-btn">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCourseModal && (
                <div className="modal-overlay" onClick={() => { setShowCourseModal(false); setFormError('') }}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h3>Planifier un nouveau cours</h3>
                        {formError ? <p className="empty-state">{formError}</p> : null}
                        <form onSubmit={submitCourse} className="modal-form">
                            <input
                                type="text"
                                placeholder="Intitulé du cours"
                                value={courseForm.title}
                                onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
                            />
                            <input
                                type="text"
                                placeholder="Salle"
                                value={courseForm.room}
                                onChange={(e) => setCourseForm((prev) => ({ ...prev, room: e.target.value }))}
                            />
                            <select
                                value={courseForm.teacherId}
                                onChange={(e) => setCourseForm((prev) => ({ ...prev, teacherId: e.target.value }))}
                                disabled={teachers.length === 0}
                            >
                                <option value="">
                                    {teachers.length === 0 ? 'Aucun professeur existant' : 'Choisir un professeur'}
                                </option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>{teacher.name} - {teacher.subject}</option>
                                ))}
                            </select>
                            <div className="inline-fields">
                                <select
                                    value={courseForm.duration}
                                    onChange={(e) => setCourseForm((prev) => ({ ...prev, duration: e.target.value }))}
                                >
                                    <option value="1h">1h</option>
                                    <option value="2h">2h</option>
                                    <option value="3h">3h</option>
                                </select>
                                <select
                                    value={courseForm.color}
                                    onChange={(e) => setCourseForm((prev) => ({ ...prev, color: e.target.value as Course['color'] }))}
                                >
                                    <option value="blue">Bleu</option>
                                    <option value="green">Vert</option>
                                    <option value="purple">Violet</option>
                                    <option value="yellow">Jaune</option>
                                </select>
                            </div>
                            <div className="action-row">
                                <button type="button" className="ghost-btn" onClick={() => { setShowCourseModal(false); setFormError('') }}>Annuler</button>
                                <button type="submit" className="primary-btn" disabled={teachers.length === 0}>Créer le cours</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {selectedSlot && selectedSlotCourse && (
                <div className="modal-overlay" onClick={closeSlotModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        {slotMode === 'actions' ? (
                            <>
                                <p className="card-sub">{selectedSlot.day} · {selectedSlot.time}</p>
                                <h3>{selectedSlotCourse.title}</h3>
                                <p className="empty-state">
                                    {selectedSlotCourse.room} · {selectedSlotCourse.duration}
                                </p>
                                <div className="action-row">
                                    <button type="button" className="ghost-btn" onClick={closeSlotModal}>Annuler</button>
                                    <button type="button" className="danger-btn" onClick={removeSlotCourse}>Supprimer</button>
                                    <button type="button" className="primary-btn" onClick={() => setSlotMode('edit')}>Modifier</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>Modifier le cours</h3>
                                {formError ? <p className="empty-state">{formError}</p> : null}
                                <form onSubmit={saveSlotCourse} className="modal-form">
                                    <input
                                        type="text"
                                        placeholder="Intitulé du cours"
                                        value={courseForm.title}
                                        onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Salle"
                                        value={courseForm.room}
                                        onChange={(e) => setCourseForm((prev) => ({ ...prev, room: e.target.value }))}
                                    />
                                    <select
                                        value={courseForm.teacherId}
                                        onChange={(e) => setCourseForm((prev) => ({ ...prev, teacherId: e.target.value }))}
                                        disabled={teachers.length === 0}
                                    >
                                        <option value="">
                                            {teachers.length === 0 ? 'Aucun professeur existant' : 'Choisir un professeur'}
                                        </option>
                                        {teachers.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>{teacher.name} - {teacher.subject}</option>
                                        ))}
                                    </select>
                                    <div className="inline-fields">
                                        <select
                                            value={courseForm.duration}
                                            onChange={(e) => setCourseForm((prev) => ({ ...prev, duration: e.target.value }))}
                                        >
                                            <option value="1h">1h</option>
                                            <option value="2h">2h</option>
                                            <option value="3h">3h</option>
                                        </select>
                                        <select
                                            value={courseForm.color}
                                            onChange={(e) => setCourseForm((prev) => ({ ...prev, color: e.target.value as Course['color'] }))}
                                        >
                                            <option value="blue">Bleu</option>
                                            <option value="green">Vert</option>
                                            <option value="purple">Violet</option>
                                            <option value="yellow">Jaune</option>
                                        </select>
                                    </div>
                                    <div className="action-row">
                                        <button type="button" className="ghost-btn" onClick={() => setSlotMode('actions')}>Retour</button>
                                        <button type="submit" className="primary-btn">Enregistrer</button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}