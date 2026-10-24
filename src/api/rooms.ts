export type Room = {
    id: string
    name: string
    building: string
    capacity?: number
    type:
        | 'classroom'
        | 'lab'
        | 'amphitheater'
}