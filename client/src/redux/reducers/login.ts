import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

interface LoginState {
    userName: string
}

const initialState: LoginState = {
    userName: '',
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => {
            state.userName = action.payload
        },
    },
})

export const { setUserName } = loginSlice.actions

export const selectCount = (state: RootState) => state.counter.value

export default loginSlice.reducer
