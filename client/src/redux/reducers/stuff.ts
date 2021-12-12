import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Stuff } from '../../types'

interface StuffState {
    data: Stuff[]
}

const initialState: StuffState = {
    data: []
}

export const stuffSlice = createSlice({
    name: 'stuff',
    initialState,
    reducers: {
        setStuff: (state, action: PayloadAction<Stuff[] | null>) => {
            state.data = action?.payload?.sort((a, b) => {
                if (a.id && b.id) {
                    return a.id - b.id
                }
                return 0
            }) || []
        },
    },
})

export const { setStuff } = stuffSlice.actions

export default stuffSlice.reducer
