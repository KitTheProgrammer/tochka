import React, { useCallback, useState } from 'react'
import {
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'

import MenuBar from '../../components/MenuBar'
import { useAppDispatch, useAppSelector } from '../../hooks'
import MainBody from '../../components/MainBody'
import { getAllStuff, getCalendar } from '../../api'
import { setToast } from '../../redux/reducers/toast'
import { CalendarData } from '../../types'
import { setCalendar } from '../../redux/reducers/calendar'
import Info from '../../components/Info'
import Stuff from '../../components/Stuff'
import { setStuff } from '../../redux/reducers/stuff'

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

    const updateStuff = useCallback(async () => {
        const res = await getAllStuff()
        if (res.error) {
            dispatch(setToast({ message: res.message, error: true }))
        } else {
            dispatch(setStuff(res.payload))
        }
    }, [dispatch])

    const updatePages = useCallback(async () => {
        await updateCalendar()
        await updateStuff()
    }, [updateStuff, updateCalendar])

    if (!userInfo.name) {
        return <Navigate to={'/login'} replace/>
    }

    if (loading) {
        return <></>
    }

    return <>
        <MenuBar updatePages={updatePages}/>
        <Routes>
            <Route path={'/stuff'} element={<Stuff updateStuff={updateStuff}/>}/>
            <Route path={'/info'} element={<Info/>}/>
            <Route path={'/'} element={<MainBody updateCalendar={updateCalendar}/>}/>
        </Routes>
    </>
}

export default MainPage
