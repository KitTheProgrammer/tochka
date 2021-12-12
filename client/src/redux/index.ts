import { configureStore } from '@reduxjs/toolkit'
import rolesReducer from './reducers/roles'
import loginReducer from './reducers/login'
import bandsReducer from './reducers/bands'
import toastReducer from './reducers/toast'
import eventModalControllerReducer from './reducers/eventModalController'
import calendarReducer from './reducers/calendar'
import stuff from './reducers/stuff'
import stuffModalController from './reducers/stuffModalController'

export const store = configureStore({
    reducer: {
        roles: rolesReducer,
        login: loginReducer,
        bands: bandsReducer,
        toast: toastReducer,
        eventModalController: eventModalControllerReducer,
        calendar: calendarReducer,
        stuff: stuff,
        stuffModalController: stuffModalController,
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
