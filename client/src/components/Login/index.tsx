import React, { useState } from 'react'
import './styles/styles.css'

export interface LoginProps {
    onLogin: (userName: string) => void
}

const Login = (props: LoginProps): React.ReactElement => {
    const { onLogin } = props

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    return <div className={'login'}>
        <input
            className={'login__input'}
            value={userName}
            onChange={({ target: { value } }) => setUserName(value)}
            placeholder={'User name'}
        />
        <input
            className={'login__input'}
            type={'password'} value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            placeholder={'Password'}
        />
        <button className={'login__submit'} onClick={() => onLogin(userName)}>Login</button>
    </div>
}

export default Login
