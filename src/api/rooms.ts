export type Room = {
    id: string
    _id?: string
    name: string
    building: 'A' | 'G'
    capacity?: number
    type: 'classroom' | 'lab' | 'amphitheater'
}

export type RoomPayload = {
    name: string
    building: string
    capacity?: number
    type: Room['type']
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

const normalizeRoom = (room: Room): Room => ({
    ...room,
    id: room.id ?? room._id ?? '',
})

export const getRooms = async (): Promise<Room[]> => {
    const res = await fetch(
        `${API_BASE}/api/rooms`
    )

    const rooms = await parseJson<Room[]>(res)

    return rooms.map(normalizeRoom)
}

export const createRoom = async (
    payload: RoomPayload
): Promise<Room> => {
    const res = await fetch(`${API_BASE}/api/rooms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    const room = await parseJson<Room>(res)

    return normalizeRoom(room)
}

export const updateRoom = async (
    id: string,
    payload: RoomPayload
): Promise<Room> => {
    const res = await fetch(`${API_BASE}/api/rooms/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    const room = await parseJson<Room>(res)

    return normalizeRoom(room)
}

export const deleteRoom = async (
    id: string
): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/api/rooms/${id}`, {
        method: 'DELETE',
    })

    return parseJson<{ message: string }>(res)
}