import React, { useCallback, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setUserName } from '../../redux/reducers/login'
import Login from '../../components/Login'

const LoginPage = (): React.ReactElement => {
    const dispatch = useAppDispatch()
    const [redirect, setRedirect] = useState(false)
    const onLogin = useCallback((userName: string) => {
        dispatch(setUserName(userName))
        setRedirect(true)
    }, [dispatch, setRedirect])

    return <>
        {(redirect) ? <Navigate to={'/main'} replace/> : <Login onLogin={onLogin}/>}
    </>
}

export default LoginPage
