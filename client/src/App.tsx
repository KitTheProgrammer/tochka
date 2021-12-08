import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks'
import { getRoles, getBands } from './api'
import DefaultRouter from './routes'
import { setRoles } from './redux/reducers/roles'
import { setBands } from './redux/reducers/bands'

import './App.css'
import '@fortawesome/fontawesome-free/css/all.css'

import Toast from './components/Toast'

function App() {
    const dispatch = useAppDispatch()
    const roles = useAppSelector(({ roles }) => roles.value)
    const bands = useAppSelector(({ bands }) => bands.value)

    useEffect(() => {
        if (!roles || !roles.length) {
            getRoles().then((res) => dispatch(setRoles(res.payload))).catch((e) => console.log(e))
        }
        if (!bands || !bands.length) {
            getBands().then((res) => dispatch(setBands(res.payload))).catch((e) => console.log(e))
        }
    })

    return (
        <div className={'App'}>
            <Toast/>
            <DefaultRouter/>
        </div>
    )
}

export default App
