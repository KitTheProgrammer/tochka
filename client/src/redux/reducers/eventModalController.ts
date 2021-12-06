import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CalendarEvent } from '../../types'

interface EventModalState {
    showModal: boolean
    eventInfo: CalendarEvent | null
    new: boolean
}

const initialState: EventModalState = {
    showModal: false,
    eventInfo: null,
    new: false,
}

export const eventModalControllerSlice = createSlice({
    name: 'eventModalController',
    initialState,
    reducers: {
        setShowEventModal: (state, action: PayloadAction<boolean>) => {
            if (!action.payload) {
                state.eventInfo = null
            }

            state.showModal = action.payload
        },
        setEventInfo: (state, action: PayloadAction<CalendarEvent>) => {
            state.eventInfo = action.payload
            state.new = false
        },
        setNewEvent: (state, action) => {
            state.new = true
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
