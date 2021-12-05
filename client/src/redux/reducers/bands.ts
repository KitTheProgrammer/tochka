import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Band } from '../../types'

interface BandState {
    value: Band[]
}

const initialState: BandState = {
    value: []
}

export const bandsSlice = createSlice({
    name: 'bands',
    initialState,
    reducers: {
        setBands: (state, action?: PayloadAction<Band[] | null>) => {
            state.value = action?.payload || []
        },
    },
})

export const { setBands } = bandsSlice.actions

export default bandsSlice.reducer
