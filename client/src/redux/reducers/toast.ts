import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ToastState {
    error: boolean
    message: string | null
    showToast: boolean
}

interface ToastPayload {
    message: string | null
    error: boolean
}

const initialState: ToastState = {
    error: false,
    message: null,
    showToast: false,
}

export const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        setToast: (state, action: PayloadAction<ToastPayload>) => {
            state.message = action.payload.message
            state.error = action.payload.error
            state.showToast = true
        },
        unsetToast: (state) => {
            state.message = initialState.message
            state.error = initialState.error
            state.showToast = initialState.showToast
        },
    },
})

export const { setToast, unsetToast } = toastSlice.actions

export default toastSlice.reducer
