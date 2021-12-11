import React, { useCallback, useState } from 'react'
import {
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'

import MenuBar from '../../components/MenuBar'
import { useAppDispatch, useAppSelector } from '../../hooks'
import MainBody from '../../components/MainBody'
import { getCalendar } from '../../api'
import { setToast } from '../../redux/reducers/toast'
import { CalendarData } from '../../types'
import { setCalendar } from '../../redux/reducers/calendar'
import Info from '../../components/Info'
import Stuff from '../../components/Stuff'

const MainPage = (): React.ReactElement => {
    const dispatch = useAppDispatch()
    const userInfo = useAppSelector(({ login }) => login.userInfo)
    const [loading, setLoading] = useState(false)

    const updateCalendar = useCallback(async () => {
        setLoading(true)
        const calendarRes = await getCalendar()

        if (calendarRes.error) {
            dispatch(setToast({ message: calendarRes.message, error: true }))
        } else {
            if (calendarRes.payload && calendarRes.payload.length) {
                const calendarData: CalendarData = {}
                calendarRes.payload.forEach((it) => {
                    if (calendarData[it.date]) {
                        calendarData[it.date].push(it)
                    } else {
                        calendarData[it.date] = [ it ]
                    }
                })
                dispatch(setCalendar(calendarData))
            }

            dispatch(setToast({ message: 'Success!)', error: false }))
        }
        setLoading(false)
    }, [dispatch])

    if (!userInfo.name) {
        return <Navigate to={'/login'} replace/>
    }

    if (loading) {
        return <></>
    }

    return <>
        <MenuBar updateCalendar={updateCalendar}/>
        <Routes>
            <Route path={'/stuff'} element={<Stuff/>}/>
            <Route path={'/info'} element={<Info/>}/>
            <Route path={'/'} element={<MainBody updateCalendar={updateCalendar}/>}/>
        </Routes>
    </>
}

export default MainPage
