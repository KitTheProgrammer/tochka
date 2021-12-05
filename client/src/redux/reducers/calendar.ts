import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CalendarData } from '../../types'

interface CalendarState {
    data: CalendarData
}

const initialState: CalendarState = {
    data: {},
}

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        setCalendar: (state, action: PayloadAction<CalendarData>) => {
            state.data = action.payload
        },
    },
})

export const { setCalendar } = calendarSlice.actions

export default calendarSlice.reducer
