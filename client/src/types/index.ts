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
    id: number
    startAt: string
    endAt: string
    timezoneStartAt?: string
    timezoneEndAt?: string
    summary: string
    color: string
    created_by?: number | string | null
    blocked_by?: number
    updated_at?: string
    blocked?: string
    individual?: boolean
    band_id?: number
    repeat?: boolean
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

export interface UseEventResponse {
    error: boolean
    message: string | null
    payload: { id: number, blocked: boolean, blocked_by: number }
}

export interface Person {
    id: number
    display_name: string
    login?: string
}

export interface PersonResponse {
    error: boolean
    message: string | null
    payload: Person | null
}

export interface Stuff {
    id?: number
    name: string
    created_by: string
    created_by_id: number
    used_by: string[]
    acceptable_users: string[]
    available: boolean
}

export interface StuffResponse {
    error: boolean,
    message: string | null
    payload: Stuff[] | null
}

export interface AllUsersResponse {
    error: boolean,
    message: string | null
    payload: Person[] | null
}
