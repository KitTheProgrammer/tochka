import {
    BandsResponse, CalendarEvent,
    CalendarResponse,
    LoginResponse,
    PersonResponse,
    RoleResponse,
    UseEventResponse,
} from '../types'
import { post, get } from './helpers'

export const loginReq = async (login: string, password: string): Promise<LoginResponse> => {
    const response = await post('login', { login, password })

    return await response.json()
}

export const getBands = async (): Promise<BandsResponse> => {
    const response = await get('bands')

    return await response.json()
}

export const getRoles = async (): Promise<RoleResponse> => {
    const response = await get('roles')

    return await response.json()
}

export const getUserBands = async (userId?: number): Promise<BandsResponse> => {
    const response = await post('userBands', { userId })

    return await response.json()
}

export const getCalendar = async (): Promise<CalendarResponse> => {
    const response = await get('calendar')

    return await response.json()
}

export const checkEventUsage = async (eventId: number, userId: number): Promise<UseEventResponse> => {
    const response = await post('useEvent', { eventId, userId })

    return await response.json()
}

export const getPersonById = async (personId?: number): Promise<PersonResponse> => {
    const response = await post('getPerson', { personId })

    return await response.json()
}

export const setEventStatus = async (userId: number, status: boolean, eventId?: number): Promise<any> => {
    const response = await post('setEventStatus', { userId, status, eventId })

    return await response.json()
}

export const updateEvent = async (data: CalendarEvent | null) => {
    const response = await post('updateEvent', data)

    return await response.json()
}

export const deleteEvent = async (eventId?: number) => {
    const response = await post('deleteEvent', { eventId })

    return await response.json()
}
