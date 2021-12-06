import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CalendarEvent } from '../../types'

interface EventModalState {
    showModal: boolean
    eventInfo: CalendarEvent | null
    isNew: boolean
}

const initialState: EventModalState = {
    showModal: false,
    eventInfo: null,
    isNew: false,
}

export const eventModalControllerSlice = createSlice({
    name: 'eventModalController',
    initialState,
    reducers: {
        setShowEventModal: (state, action: PayloadAction<{ showModal: boolean, isNew?: boolean }>) => {
            if (!action.payload) {
                state.eventInfo = null
            }

            state.showModal = action.payload.showModal
            if (action.payload.isNew !== undefined) state.isNew = action.payload.isNew
        },
        setEventInfo: (state, action: PayloadAction<CalendarEvent>) => {
            state.eventInfo = action.payload
        },
        setEventInfoParameter: (state, action: PayloadAction<{ key: keyof CalendarEvent, value: any}>) => {
            if (state.eventInfo) {
                state.eventInfo[action.payload.key] = action.payload.value
            }
        }
    },
})

export const { setShowEventModal, setEventInfo, setEventInfoParameter } = eventModalControllerSlice.actions

export default eventModalControllerSlice.reducer
