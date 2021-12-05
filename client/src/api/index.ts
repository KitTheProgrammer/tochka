import { BandsResponse, CalendarResponse, LoginResponse, RoleResponse } from '../types'
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
