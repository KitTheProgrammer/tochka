import React, { useCallback, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setUserName } from '../../redux/reducers/login'
import Login from '../../components/Login'

const LoginPage = (): React.ReactElement => {
    const dispatch = useAppDispatch()
    const [redirect, setRedirect] = useState(false)

    const callApi = useCallback(async () => {
        const response = await fetch('/api/hello');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    }, [])

    const onLogin = useCallback((userName: string) => {
        dispatch(setUserName(userName))
        callApi()
            .then(res => console.log(res))
            .catch(err => console.log(err));
        setRedirect(true)
    }, [dispatch, setRedirect, callApi])

    return <>
        {(redirect) ? <Navigate to={'/main'} replace/> : <Login onLogin={onLogin}/>}
    </>
}

export default LoginPage
