import React, { useCallback, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setUserName } from '../../redux/reducers/login'
import Login from '../../components/Login'
import { log } from 'util'

const LoginPage = (): React.ReactElement => {
    const dispatch = useAppDispatch()
    const [redirect, setRedirect] = useState(false)

    const callApi = useCallback(async (login: string, password: string) => {
        const response = await fetch('/api/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    }, [])

    const onLogin = useCallback(async (login: string, password: string) => {
        dispatch(setUserName(login))

        const res = await callApi(login, password)

        console.log(res)

        if (res.error) {

        } else {
            console.log(res.payload['display_name'].length)
            setRedirect(true)
        }
    }, [dispatch, setRedirect, callApi])

    return <>
        {(redirect) ? <Navigate to={'/main'} replace/> : <Login onLogin={onLogin}/>}
    </>
}

export default LoginPage
