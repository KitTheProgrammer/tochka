import React, { useState } from 'react'
import './styles/styles.css'

export interface LoginProps {
    onLogin: (userName: string, password: string) => void
}

const Login = (props: LoginProps): React.ReactElement => {
    const { onLogin } = props

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    return <div className={'login'}>
        <input
            className={'login__input'}
            value={login}
            onChange={({ target: { value } }) => setLogin(value)}
            placeholder={'User name'}
        />
        <input
            className={'login__input'}
            type={'password'} value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            placeholder={'Password'}
        />
        <button className={'login__submit'} onClick={() => onLogin(login, password)}>Login</button>
    </div>
}

export default Login
