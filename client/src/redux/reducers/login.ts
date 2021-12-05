import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Band } from '../../types'

export interface UserInfo {
    id: number
    name: string | null
    bands: Band[]
    roleId: number | null
}

interface LoginState {
    userInfo: UserInfo
}

const initialState: LoginState = {
    userInfo: {
        name: '',
        id: 0,
        bands: [],
        roleId: null,
    },
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload
        },
    },
})

export const { setUserInfo } = loginSlice.actions

export default loginSlice.reducer
