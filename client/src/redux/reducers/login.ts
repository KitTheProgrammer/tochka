import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Band, Person } from '../../types'

export interface UserInfo {
    id: number
    name: string | null
    bands: Band[]
    roleId: number | null
}

interface LoginState {
    userInfo: UserInfo
    allUsers: Person[]
}

const initialState: LoginState = {
    userInfo: {
        name: '',
        id: 0,
        bands: [],
        roleId: null,
    },
    allUsers: [],
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload
        },
        setAllUsers: (state, action: PayloadAction<Person[] | null>) => {
            state.allUsers = action.payload || []
        }
    },
})

export const { setUserInfo, setAllUsers } = loginSlice.actions

export default loginSlice.reducer
