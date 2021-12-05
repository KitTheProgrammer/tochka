import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface EventModalState {
    showModal: boolean
}

const initialState: EventModalState = {
    showModal: false,
}

export const eventModalControllerSlice = createSlice({
    name: 'eventModalController',
    initialState,
    reducers: {
        setShowEventModal: (state, action: PayloadAction<boolean>) => {
            state.showModal = action.payload
        },
    },
})

export const { setShowEventModal } = eventModalControllerSlice.actions

export default eventModalControllerSlice.reducer
