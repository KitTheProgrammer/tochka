import {
    AllUsersResponse,
    BandsResponse, CalendarEvent,
    CalendarResponse,
    LoginResponse,
    PersonResponse,
    RoleResponse, Stuff, StuffResponse,
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

export const deleteEvent = async (eventId?: number, userId?: number) => {
    const response = await post('deleteEvent', { eventId, userId })

    return await response.json()
}

export const createEvent = async (data: CalendarEvent | null) => {
    const response = await post('createEvent', data)

    return await response.json()
}

export const changePassword = async (userId: number, oldPass: string, newPass: string) => {
    const response = await post('changePassword', { userId, oldPass, newPass })

    return await response.json()
}

export const getAllStuff = async (): Promise<StuffResponse> => {
    const response = await get('getAllStuff')

    return await response.json()
}

export const getStuffById = async (stuffId: number): Promise<StuffResponse> => {
    const response = await post('getStuffById', { stuffId })

    return await response.json()
}

export const updateStuff = async (data: Stuff | null): Promise<StuffResponse> => {
    const response = await post('updateStuff', data || {})

    return await response.json()
}

export const createStuff = async (data: Stuff | null): Promise<StuffResponse> => {
    const response = await post('createStuff', data || {})

    return await response.json()
}

export const deleteStuff = async (stuffId?: number): Promise<StuffResponse> => {
    const response = await post('deleteStuff', { stuffId })

    return await response.json()
}

export const getAllUsers = async (): Promise<AllUsersResponse> => {
    const response = await get('getAllUsers')

    return await response.json()
}
