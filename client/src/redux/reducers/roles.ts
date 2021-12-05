import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Role } from '../../types'

interface RoleState {
    value: Role[]
}

const initialState: RoleState = {
    value: []
}

export const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        setRoles: (state, action: PayloadAction<Role[] | null>) => {
            state.value = action?.payload || []
        },
    },
})

export const { setRoles } = rolesSlice.actions

export default rolesSlice.reducer
