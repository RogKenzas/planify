import { useEffect, useMemo, useState } from 'react'
import { createCourse, createTeacher, getCourses, getTeachers, updateCourse, getClassroomSchedule, upsertScheduleSlot, deleteScheduleSlot, type Course, type Teacher, type ScheduleSlot, deleteAllCourses, deleteAllTeachers } from '../api/schedule'
import LeftSideBar from '../components/leftSideBar'
import TopSideBar from '../components/topSideBar'
import './dashboardInterface.css'
import ClassroomManager from '../components/classrooms/ClassroomManager'
import { getClassrooms, type Classroom } from '../api/classrooms'
import { createRoom, getRooms, type Room, type RoomPayload } from '../api/rooms'
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import RoomManager from '../components/rooms/RoomManager'
import RoomModal from '../components/rooms/RoomModal'

type Reminder = {
    id: string
    title: string
    due: string
    priority: 'haute' | 'moyenne' | 'basse'
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
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
    const [draggedScheduleSlot, setDraggedScheduleSlot] = useState<ScheduleSlot | null>(null)
    const [isUpdatingCourse, setIsUpdatingCourse] = useState(false);
    const [isDeletingCourse, setIsDeletingCourse] = useState(false);
    const [roomModalOpen, setRoomModalOpen] = useState(false)
    const [roomSaving, setRoomSaving] = useState(false)
    const [roomError, setRoomError] = useState('')
    const [clearCoursesModalOpen, setClearCoursesModalOpen] = useState(false)
    const [clearTeachersModalOpen, setClearTeachersModalOpen] = useState(false)
    const [isClearingTeachers, setIsClearingTeachers] = useState(false)
    const [isClearingCourses, setIsClearingCourses] = useState(false)
    const [reminders] = useState<Reminder[]>([
        { id: 'r1', title: 'Réunion parents/professeurs', due: 'Aujourd’hui - 16:30', priority: 'haute' },
        { id: 'r2', title: 'Valider les emplois du temps', due: 'Demain - 11:00', priority: 'moyenne' },
        { id: 'r3', title: 'Contrôle qualité planning', due: 'Vendredi - 09:30', priority: 'basse' },
    ])

    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [courses, setCourses] = useState<Course[]>([])
    const [classrooms, setClassrooms] = useState<Classroom[]>([])
    const [schedule, setSchedule] = useState<ScheduleSlot[]>([])
    const [rooms, setRooms] = useState<Room[]>([])
    const [isScheduleLoading, setIsScheduleLoading] = useState(false)
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null)
    const [selectedPhysicalRoom, setSelectedPhysicalRoom] = useState<Room | null>(null)
    const [formError, setFormError] = useState('')
    const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null)
    const [slotMode, setSlotMode] = useState<'actions' | 'edit'>('actions')
    const [teacherForm, setTeacherForm] = useState({ name: '', subject: '' })
    const [courseForm, setCourseForm] = useState({ title: '', duration: '2h', teacherId: '', color: 'blue' as Course['color'], })
    useEffect(() => {
        const loadPlanningData = async () => {

            const [
                teacherResult,
                courseResult,
                classroomResult,
                roomResult
            ] = await Promise.allSettled([
                getTeachers(),
                getCourses(),
                getClassrooms(),
                getRooms()
            ])

            setTeachers(
                teacherResult.status === 'fulfilled'
                    ? teacherResult.value
                    : []
            )

            setCourses(
                courseResult.status === 'fulfilled'
                    ? courseResult.value
                    : []
            )

            setClassrooms(
                classroomResult.status === 'fulfilled'
                    ? classroomResult.value
                    : []
            )

            if (roomResult.status === 'fulfilled') {
                console.log(
                    'Salles physiques chargées :',
                    roomResult.value
                )

                setRooms(roomResult.value)
            } else {
                console.error(
                    'Erreur chargement salles physiques :',
                    roomResult.reason
                )

                setRooms([])
            }
        }

        void loadPlanningData()
    }, [])

    const openCreateRoomModal = () => { setRoomError(''), setRoomModalOpen(true) }
    const closeRoomModal = () => {
        if (roomSaving) {
            return
        }
        setRoomError('')
        setRoomModalOpen(false)
    }

    const handleCreateRoom = async (payload: RoomPayload) => {
        setRoomSaving(true)
        setRoomError('')

        try {
            /*
             * Création MongoDB via :
             * POST /api/rooms
             */
            await createRoom(payload)

            /*
             * On recharge depuis MongoDB pour conserver
             * le backend comme source de vérité.
             */
            const refreshedRooms = await getRooms()

            setRooms(refreshedRooms)

            setRoomModalOpen(false)

        } catch (error) {
            console.error(
                'Erreur création salle :',
                error
            )

            setRoomError(
                error instanceof Error
                    ? error.message
                    : 'Impossible de créer la salle.'
            )

        } finally {
            setRoomSaving(false)
        }
    }

    const totalPlanned = schedule.length
    const activeTeachers = teachers.length

    const onDropCourse = async (
        day: string,
        time: string
    ) => {
        console.log('DROP :', {
            draggedCourseId,
            selectedClassroom,
            selectedPhysicalRoom,
            day,
            time,
        })

        /*
         * Une classe doit être sélectionnée.
         */
        if (!selectedClassroom) {
            setFormError(
                'Sélectionne une classe avant de planifier un cours.'
            )
            return
        }

        /*
         * Une salle physique doit être sélectionnée
         * avant le drag & drop.
         */
        if (!selectedPhysicalRoom) {
            setFormError(
                'Sélectionne une salle physique avant de déposer le cours.'
            )
            return
        }

        /*
         * Un cours doit réellement être en cours de déplacement.
         */
        if (!draggedCourseId) {
            return
        }

        /*
         * Déplacement vers exactement le même créneau.
         */
        if (
            draggedScheduleSlot &&
            draggedScheduleSlot.day === day &&
            draggedScheduleSlot.time === time
        ) {
            setDraggedCourseId(null)
            setDraggedScheduleSlot(null)
            return
        }

        setFormError('')
        setIsScheduleLoading(true)

        try {
            /*
             * Enregistrement du nouveau créneau.
             *
             * On dispose maintenant de toutes
             * les informations nécessaires :
             *
             * classe + cours + salle + jour + heure
             */
            await upsertScheduleSlot(
                selectedClassroom.id,
                {
                    courseId: draggedCourseId,
                    roomId: selectedPhysicalRoom.id,
                    day,
                    time,
                }
            )

            /*
             * Si nous déplaçons un cours déjà présent
             * dans le planning, supprimer son ancien créneau.
             */
            if (draggedScheduleSlot) {
                await deleteScheduleSlot(
                    selectedClassroom.id,
                    draggedScheduleSlot.id
                )
            }

            /*
             * MongoDB reste notre source de vérité.
             */
            const refreshedSchedule =
                await getClassroomSchedule(
                    selectedClassroom.id
                )

            setSchedule(refreshedSchedule)

        } catch (error) {
            console.error(
                'Erreur planification du cours :',
                error
            )

            /*
             * En cas d'échec, recharger l'état réel.
             */
            try {
                const refreshedSchedule =
                    await getClassroomSchedule(
                        selectedClassroom.id
                    )

                setSchedule(refreshedSchedule)

            } catch (refreshError) {
                console.error(
                    'Erreur rechargement planning :',
                    refreshError
                )
            }

            setFormError(
                error instanceof Error
                    ? error.message
                    : 'Impossible de planifier le cours.'
            )

        } finally {
            setDraggedCourseId(null)
            setDraggedScheduleSlot(null)
            setIsScheduleLoading(false)
        }
    }

    const getSlotCourse = (
        day: string,
        time: string
    ) => {
        const slot = schedule.find(
            (entry) =>
                entry.day === day &&
                entry.time === time
        )

        if (!slot) {
            return null
        }

        return (
            slot.course ??
            courses.find(
                (course) => course.id === slot.courseId
            ) ??
            null
        )
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
            duration: course.duration,
            teacherId: course.teacherId,
            color: course.color,
        })
    }

    const closeSlotModal = () => {
        setSelectedSlot(null)
        setSlotMode('actions')
        setFormError('')

        setCourseForm({
            title: '',
            duration: '2h',
            teacherId: '',
            color: 'blue'
        })
    }

    const removeSlotCourse = async () => {
        if (!selectedSlot || !selectedClassroom) {
            return
        }

        const slot = schedule.find(
            (entry) =>
                entry.day === selectedSlot.day &&
                entry.time === selectedSlot.time
        )

        if (!slot) {
            return
        }

        setFormError('')
        setIsScheduleLoading(true)

        try {
            await deleteScheduleSlot(
                selectedClassroom.id,
                slot.id
            )

            setSchedule((previousSchedule) =>
                previousSchedule.filter(
                    (entry) => entry.id !== slot.id
                )
            )

            closeSlotModal()

        } catch (error) {
            console.error(
                'Erreur suppression du créneau :',
                error
            )

            setFormError(
                error instanceof Error
                    ? error.message
                    : 'Impossible de supprimer le cours du planning.'
            )
        } finally {
            setIsScheduleLoading(false)
        }
    }

    const saveSlotCourse = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedSlotCourse || !courseForm.title || !courseForm.teacherId) return
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
        if (
            !courseForm.title ||
            !courseForm.teacherId
        ) {
            setFormError(
                'Veuillez renseigner le cours et le professeur.'
            )
            return
        } setFormError('')
        try {
            const course = await createCourse(courseForm)
            setCourses((prev) => [course, ...prev])
            setCourseForm({ title: '', duration: '2h', teacherId: '', color: 'blue' })
            setShowCourseModal(false)
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "Impossible d'enregistrer le cours")
        }
    }

    const handleDeleteCourse = (course: Course) => {
        setCourseToDelete(course);
        setOpenMenuId(null);
    };

    const handleClearTeachers = async () => {

        try {

            setIsClearingTeachers(true)
            setFormError('')

            await deleteAllTeachers()

            /*
             * Le backend supprime :
             * - professeurs
             * - cours
             * - classes
             * - créneaux
             */

            setTeachers([])
            setCourses([])
            setClassrooms([])
            setSchedule([])

            setSelectedClassroom(null)

            setOpenMenuId(null)

            setClearTeachersModalOpen(false)

        } catch (error) {

            console.error(
                'Erreur suppression des professeurs :',
                error
            )

            setFormError(
                error instanceof Error
                    ? error.message
                    : 'Impossible de supprimer les professeurs'
            )

        } finally {

            setIsClearingTeachers(false)

        }
    }

    const confirmDeleteCourse = async () => {
        if (!courseToDelete) return;

        setIsDeletingCourse(true);
        setFormError('');

        try {
            const courseId = courseToDelete.id;

            const url =
                `https://backend-planify-jsk6.onrender.com/api/courses/${courseId}`;

            console.log("COURSE COMPLET :", courseToDelete);
            console.log("ID À SUPPRIMER :", courseId);
            console.log("URL DELETE :", url);

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("STATUS DELETE :", response.status);

            const responseText = await response.text();

            console.log("RÉPONSE BACKEND :", responseText);

            if (!response.ok) {
                throw new Error(
                    `Erreur ${response.status} : ${responseText}`
                );
            }

            setCourses((prev) =>
                prev.filter((course) => course.id !== courseId)
            );

            setSchedule((prev) =>
                prev.filter((entry) => entry.courseId !== courseId)
            );

            setCourseToDelete(null);

        } catch (error) {
            console.error("ERREUR DELETE :", error);

            setFormError(
                error instanceof Error
                    ? error.message
                    : "Impossible de supprimer le cours."
            );
        } finally {
            setIsDeletingCourse(false);
        }
    };

    const handleEditCourse = (course: Course) => {
        // On mémorise exactement le cours sélectionné
        setCourseToEdit(course);

        // On remplit le formulaire avec ses données actuelles
        setCourseForm({
            title: course.title,
            duration: course.duration,
            teacherId: course.teacherId,
            color: course.color,
        });

        setFormError('');
        setOpenMenuId(null);
    };

    const submitEditCourse = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!courseToEdit) {
            return;
        }

        if (
            !courseForm.title ||
            !courseForm.teacherId
        ) {
            setFormError("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        setFormError('');
        setIsUpdatingCourse(true);

        try {
            // IMPORTANT :
            // voici l'ID exact du cours sélectionné
            const courseId = courseToEdit.id;

            console.log("Modification du cours ID :", courseId);

            const updatedCourse = await updateCourse(
                courseId,
                courseForm
            );

            // Mise à jour du cours dans l'interface
            setCourses((previousCourses) =>
                previousCourses.map((course) =>
                    course.id === updatedCourse.id
                        ? updatedCourse
                        : course
                )
            );

            // Fermer la modale
            setCourseToEdit(null);

            // Nettoyer le formulaire
            setCourseForm({
                title: '',
                duration: '2h',
                teacherId: '',
                color: 'blue',
            });

        } catch (error) {

            console.error("Erreur modification :", error);

            setFormError(
                error instanceof Error
                    ? error.message
                    : "Impossible de modifier le cours."
            );

        } finally {
            setIsUpdatingCourse(false);
        }
    };

    const handleClearCourses = async () => {

        try {

            setIsClearingCourses(true)
            setFormError('')

            await deleteAllCourses()

            setCourses([])
            setSchedule([])

            setOpenMenuId(null)
            setClearCoursesModalOpen(false)

        } catch (error) {

            console.error(
                'Erreur vidage catalogue :',
                error
            )

            setFormError(
                error instanceof Error
                    ? error.message
                    : 'Impossible de vider le catalogue'
            )

        } finally {

            setIsClearingCourses(false)

        }
    }

    const handleSelectClassroom = async (
        classroom: Classroom
    ) => {
        setSelectedClassroom(classroom)
        setFormError('')
        setIsScheduleLoading(true)

        try {
            const classroomSchedule = await getClassroomSchedule(
                classroom.id
            )

            setSchedule(classroomSchedule)

            console.log(
                'Planning chargé pour :',
                classroom.name,
                classroomSchedule
            )
        } catch (error) {
            console.error(
                'Erreur chargement planning :',
                error
            )

            setSchedule([])

            setFormError(
                error instanceof Error
                    ? error.message
                    : "Impossible de charger l'emploi du temps."
            )
        } finally {
            setIsScheduleLoading(false)
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

                    <div className="classroom-dashboard-section">

                        <ClassroomManager
                            teachers={teachers}
                            selectedClassroomId={selectedClassroom?.id ?? null}
                            onSelectClassroom={handleSelectClassroom}
                        />

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
                            <h2>
                                {selectedClassroom
                                    ? `Emploi du temps - ${selectedClassroom.name}`
                                    : 'Emploi du temps hebdomadaire'}
                            </h2>
                            <p className="card-sub">Glisse un cours, puis double-clique un créneau pour le modifier ou le retirer.</p>
                        </div>

                        {!selectedClassroom && (
                            <p className="empty-state">
                                Sélectionne une classe pour afficher son emploi du temps.
                            </p>
                        )}

                        {isScheduleLoading && (
                            <p className="empty-state">
                                Chargement de l'emploi du temps...
                            </p>
                        )}

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
                                        const slot = schedule.find((entry) => entry.day === day && entry.time === time)

                                        return (
                                            <div
                                                key={`${day}-${time}`}
                                                className={`time-slot ${slotCourse ? `${CARD_COLORS[slotCourse.color]} filled-slot` : ''}`}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={() => onDropCourse(day, time)}
                                                onDoubleClick={() => openSlotActions(day, time)}
                                            >
                                                {slotCourse ? (
                                                    <div
                                                        draggable
                                                        className="scheduled-course-content"

                                                        onDragStart={(e) => {
                                                            e.stopPropagation()

                                                            const slot = schedule.find(
                                                                (entry) =>
                                                                    entry.day === day &&
                                                                    entry.time === time
                                                            )

                                                            setDraggedCourseId(slotCourse.id)
                                                            setDraggedScheduleSlot(slot ?? null)
                                                        }}

                                                        onDragEnd={() => {
                                                            setDraggedCourseId(null)
                                                            setDraggedScheduleSlot(null)
                                                        }}
                                                    >
                                                        <p className="card-title-sm">
                                                            {slotCourse.title}
                                                        </p>

                                                        <p className="card-sub">
                                                            {slot?.room?.name ?? 'Salle non assignée'}
                                                            {' | '}
                                                            {teachers.find(
                                                                (teacher) =>
                                                                    teacher.id === slotCourse.teacherId
                                                            )?.name ?? 'Professeur non assigné'}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="card-sub">
                                                        Déposer ici
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="room-dashboard-section">
                        <RoomManager
                            rooms={rooms}
                            selectedRoomId={
                                selectedPhysicalRoom?.id ?? null
                            }
                            onSelectRoom={(room) => {
                                setSelectedPhysicalRoom(room)
                                setFormError('')
                            }}
                            onCreateRoom={
                                openCreateRoomModal
                            }
                        />
                    </section>
                </main>

                <aside className="dashboard-col dashboard-right fade-in">

                    <section className="soft-card courses-catalog-card">
                        <div className="panel-header">

                            <h2>Catalogue des cours</h2>

                            <div className="catalog-header-actions">

                                <span className="card-sub">
                                    Drag & drop
                                </span>

                                <button
                                    type="button"
                                    className="clear-list-button"
                                    title="Vider le catalogue"
                                    aria-label="Vider le catalogue des cours"
                                    disabled={courses.length === 0}
                                    onClick={() => {
                                        setClearCoursesModalOpen(true)
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>

                            </div>

                        </div>

                        <div className="card-list courses-catalog-list">
                            {courses.length === 0 ? (
                                <p className="empty-state">Aucun cours existant</p>
                            ) : (
                                courses.map((course) => {
                                    const teacher = teachers.find(
                                        (t) => t.id === course.teacherId
                                    );

                                    return (
                                        <article
                                            key={course.id}
                                            draggable
                                            onDragStart={() => {
                                                console.log('DRAG START :', course.id, course.title)
                                                setDraggedCourseId(course.id)
                                                setDraggedScheduleSlot(null)
                                            }}
                                            onDragEnd={() => {
                                                setDraggedCourseId(null)
                                                setDraggedScheduleSlot(null)
                                            }}
                                            className={`draggable-card ${CARD_COLORS[course.color]}`}
                                        >
                                            {/* Informations du cours */}
                                            <div className="course-info">
                                                <p className="card-title-sm">
                                                    {course.title}
                                                </p>

                                                <p className="card-sub">
                                                    {teacher?.name ?? "Non assigné"} - {course.duration}
                                                </p>
                                            </div>

                                            {/* Menu actions */}
                                            <div className="course-actions" draggable={false} onMouseDown={(e) => e.stopPropagation()} onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}>

                                                <button
                                                    type="button"
                                                    className="action-menu-button"
                                                    onMouseDown={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        setOpenMenuId(
                                                            openMenuId === course.id
                                                                ? null
                                                                : course.id
                                                        );
                                                    }}
                                                >
                                                    <EllipsisVertical size={20} />
                                                </button>

                                                {/* Menu Modifier / Supprimer */}
                                                {openMenuId === course.id && (
                                                    <div className="action-menu">

                                                        <button
                                                            type="button"
                                                            onMouseDown={(e) => {
                                                                e.stopPropagation();
                                                            }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();

                                                                handleEditCourse(course);
                                                            }}
                                                        >
                                                            <Pencil size={16} />
                                                            Modifier
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="delete-action"
                                                            onMouseDown={(e) => {
                                                                e.stopPropagation();
                                                            }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();

                                                                handleDeleteCourse(course);
                                                            }}
                                                        >
                                                            <Trash2 size={16} />
                                                            Supprimer
                                                        </button>

                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })
                            )}
                            {courseToEdit && (
                                <div
                                    className="modal-overlay"
                                    onClick={() => {
                                        setCourseToEdit(null);
                                        setFormError('');
                                    }}
                                >
                                    <div
                                        className="modal-card"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <h3>Modifier le cours</h3>

                                        <p className="card-sub">
                                            Modification de : {courseToEdit.title}
                                        </p>

                                        {formError && (
                                            <p className="empty-state">
                                                {formError}
                                            </p>
                                        )}

                                        <form
                                            onSubmit={submitEditCourse}
                                            className="modal-form"
                                        >

                                            <input
                                                type="text"
                                                placeholder="Intitulé du cours"
                                                value={courseForm.title}
                                                onChange={(e) =>
                                                    setCourseForm((prev) => ({
                                                        ...prev,
                                                        title: e.target.value,
                                                    }))
                                                }
                                            />

                                            <select
                                                value={courseForm.teacherId}
                                                onChange={(e) =>
                                                    setCourseForm((prev) => ({
                                                        ...prev,
                                                        teacherId: e.target.value,
                                                    }))
                                                }
                                            >
                                                <option value="">
                                                    Choisir un professeur
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

                                            <div className="inline-fields">

                                                <select
                                                    value={courseForm.duration}
                                                    onChange={(e) =>
                                                        setCourseForm((prev) => ({
                                                            ...prev,
                                                            duration: e.target.value,
                                                        }))
                                                    }
                                                >
                                                    <option value="1h">1h</option>
                                                    <option value="2h">2h</option>
                                                    <option value="3h">3h</option>
                                                </select>

                                                <select
                                                    value={courseForm.color}
                                                    onChange={(e) =>
                                                        setCourseForm((prev) => ({
                                                            ...prev,
                                                            color: e.target.value as Course['color'],
                                                        }))
                                                    }
                                                >
                                                    <option value="blue">Bleu</option>
                                                    <option value="green">Vert</option>
                                                    <option value="purple">Violet</option>
                                                    <option value="yellow">Jaune</option>
                                                </select>

                                            </div>

                                            <div className="action-row">

                                                <button
                                                    type="button"
                                                    className="ghost-btn"
                                                    onClick={() => {
                                                        setCourseToEdit(null);
                                                        setFormError('');
                                                    }}
                                                >
                                                    Annuler
                                                </button>

                                                <button
                                                    type="submit"
                                                    className="primary-btn"
                                                    disabled={isUpdatingCourse}
                                                >
                                                    {isUpdatingCourse
                                                        ? "Modification..."
                                                        : "Enregistrer les modifications"
                                                    }
                                                </button>

                                            </div>

                                        </form>

                                    </div>
                                </div>
                            )}

                            {courseToDelete && (
                                <div
                                    className="modal-overlay"
                                    onClick={() => {
                                        if (!isDeletingCourse) {
                                            setCourseToDelete(null);
                                            setFormError('');
                                        }
                                    }}
                                >
                                    <div
                                        className="modal-card"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <h3>Supprimer le cours</h3>

                                        <p className="empty-state">
                                            Voulez-vous vraiment supprimer le cours
                                            <strong> {courseToDelete.title}</strong> ?
                                        </p>

                                        <p className="card-sub">
                                            Cette action est irréversible.
                                        </p>

                                        {formError && (
                                            <p className="empty-state">
                                                {formError}
                                            </p>
                                        )}

                                        <div className="action-row">

                                            <button
                                                type="button"
                                                className="ghost-btn"
                                                disabled={isDeletingCourse}
                                                onClick={() => {
                                                    setCourseToDelete(null);
                                                    setFormError('');
                                                }}
                                            >
                                                Annuler
                                            </button>

                                            <button
                                                type="button"
                                                className="danger-btn"
                                                disabled={isDeletingCourse}
                                                onClick={confirmDeleteCourse}
                                            >
                                                {isDeletingCourse
                                                    ? "Suppression..."
                                                    : "Oui, supprimer"
                                                }
                                            </button>

                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="soft-card teachers-card">
                        <div className="panel-header">

                            <h2>Professeurs</h2>

                            <div className="teacher-header-actions">

                                <span className="teacher-count">
                                    {teachers.length}
                                </span>

                                <button
                                    type="button"
                                    className="clear-list-button"
                                    title="Supprimer tous les professeurs"
                                    aria-label="Supprimer tous les professeurs"
                                    disabled={teachers.length === 0}
                                    onClick={() =>
                                        setClearTeachersModalOpen(true)
                                    }
                                >
                                    <Trash2 size={16} />
                                </button>

                            </div>

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

            {clearTeachersModalOpen && (

                <div className="modal-overlay">

                    <div className="modal-card clear-data-modal">

                        <h2>
                            Supprimer tous les professeurs ?
                        </h2>


                        <div className="modal-actions">

                            <button
                                type="button"
                                className="ghost-btn"
                                disabled={isClearingTeachers}
                                onClick={() =>
                                    setClearTeachersModalOpen(false)
                                }
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                className="danger-btn"
                                disabled={isClearingTeachers}
                                onClick={handleClearTeachers}
                            >
                                <Trash2 size={15} />

                                {isClearingTeachers
                                    ? 'Suppression...'
                                    : 'Supprimer'}
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {clearCoursesModalOpen && (

                <div className="modal-overlay">

                    <div className="modal-card clear-data-modal">

                        <h2>
                            Vider le catalogue ?
                        </h2>

                        <p>
                            Tous les cours du catalogue ainsi que
                            les cours déjà placés dans les emplois
                            du temps seront supprimés.
                        </p>

                        <div className="modal-actions">

                            <button
                                type="button"
                                className="ghost-btn"
                                disabled={isClearingCourses}
                                onClick={() =>
                                    setClearCoursesModalOpen(false)
                                }
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                className="danger-btn"
                                disabled={isClearingCourses}
                                onClick={handleClearCourses}
                            >
                                <Trash2 size={15} />

                                {isClearingCourses
                                    ? 'Suppression...'
                                    : 'Tout supprimer'}
                            </button>

                        </div>

                    </div>

                </div>

            )}

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
                                    {selectedClassroom?.name ?? 'Classe non assignée'} · {selectedSlotCourse.duration}
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

            <RoomModal
                open={roomModalOpen}
                room={null}
                loading={roomSaving}
                error={roomError}
                onClose={closeRoomModal}
                onSubmit={handleCreateRoom}
            />

            {isScheduleLoading && (
                <div className="planning-loader-overlay">
                    <div className="planning-loader">
                        <div className="planning-loader-square square-1"></div>
                        <div className="planning-loader-square square-2"></div>
                        <div className="planning-loader-square square-3"></div>
                        <div className="planning-loader-square square-4"></div>
                    </div>
                </div>
            )}
        </div>
    )
}