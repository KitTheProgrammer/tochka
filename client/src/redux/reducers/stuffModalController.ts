import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Stuff } from '../../types'

interface StuffModalControllerState {
    showModal: boolean
    stuffInfo: Stuff | null
    isNew: boolean
}

const initialState: StuffModalControllerState = {
    stuffInfo: null,
    showModal: false,
    isNew: false,
}

export const stuffModalControllerSlice = createSlice({
    name: 'stuffModalController',
    initialState,
    reducers: {
        setShowStuffModal: (state, action: PayloadAction<{ showModal: boolean, isNew?: boolean }>) => {
            if (!action.payload) {
                state.stuffInfo = null
            }

            state.showModal = action.payload.showModal
            if (action.payload.isNew !== undefined) state.isNew = action.payload.isNew
        },
        setStuffInfo: (state, action: PayloadAction<Stuff>) => {
            state.stuffInfo = action?.payload
        },
        setStuffInfoParameter: (state, action: PayloadAction<{ key: keyof Stuff, value: any}>) => {
            if (state.stuffInfo) {
                // @ts-ignore
                state.stuffInfo[action.payload.key] = action.payload.value
            }
        },
    },
})

export const { setShowStuffModal, setStuffInfo, setStuffInfoParameter } = stuffModalControllerSlice.actions

export default stuffModalControllerSlice.reducer
