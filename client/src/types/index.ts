export interface LoginPayload {
    id: number
    display_name: string
    role_id: number
}

export interface LoginResponse {
    error: boolean
    message: string | null
    payload: LoginPayload | null
}

export interface Band {
    id: number
    band_name: string
    band_color: string
}

export interface BandsResponse {
    error: boolean
    message: string | null
    payload: Band[]
}

export interface Role {
    id: number
    role_name: string
}

export interface RoleResponse {
    error: boolean
    message: string | null
    payload: Role[] | null
}

export interface CalendarEvent {
    startAt: string
    endAt: string
    timezoneStartAt?: string
    timezoneEndAt?: string
    summary: string
    color: string
    created_by: string
    blocked_by: number
    updated_at: string
    blocked: string
    [key: string]: any
}

export interface CalendarData {
    [key: string]: CalendarEvent[]
}

export interface CalendarResponse {
    error: boolean
    message: string | null
    payload: CalendarEvent[] | null
}
