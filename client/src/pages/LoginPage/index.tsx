import React, { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setUserInfo, UserInfo } from '../../redux/reducers/login'
import { getCalendar, getUserBands, loginReq } from '../../api'
import Login from '../../components/Login'
import { setToast } from '../../redux/reducers/toast'
import { setCalendar } from '../../redux/reducers/calendar'
import { CalendarData } from '../../types'

const LoginPage = (): React.ReactElement => {
    const dispatch = useAppDispatch()
    const [redirect, setRedirect] = useState(false)

    const onLogin = useCallback(async (login: string, password: string) => {

        const loginRes = await loginReq(login, password)

        if (loginRes.error) {
            dispatch(setToast({ message: loginRes.message, error: true }))
        } else {
            const userInfo: UserInfo = {
                name: loginRes.payload?.display_name || null,
                roleId: loginRes.payload?.role_id || null,
                id: loginRes.payload?.id || 0,
                bands: [],
            }

            const userBandsRes = await getUserBands(userInfo.id)

            if (userBandsRes.error) {
                dispatch(setToast({ message: loginRes.message, error: true }))
            } else {
                const calendarRes = await getCalendar()

                if (calendarRes.error) {
                    dispatch(setToast({ message: calendarRes.message, error: true }))
                } else {
                    userInfo.bands = userBandsRes.payload

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

                    dispatch(setUserInfo(userInfo))
                    dispatch(setToast({ message: 'Welcome!)', error: false }))
                    localStorage.setItem('loginInfo', JSON.stringify({ login, password }))

                    setRedirect(true)
                }
            }
        }
    }, [dispatch, setRedirect])

    useEffect(() => {
        const loginInfo = JSON.parse(localStorage.getItem('loginInfo') || 'null')
        if (loginInfo) {
            onLogin(loginInfo.login, loginInfo.password)
        }
    }, [onLogin])

    return <>
        {(redirect) ? <Navigate to={'/main'} replace/> : <Login onLogin={onLogin}/>}
    </>
}

export default LoginPage
