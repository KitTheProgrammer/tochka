import React, { useCallback, useState } from 'react'
import './styles/styles.css'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { Navigate, Link } from 'react-router-dom'
import { setToast } from '../../redux/reducers/toast'
import { changePassword } from '../../api'

export interface MenuBarProps {
    updateCalendar: () => void
}

const MenuBar = ({ updateCalendar }: MenuBarProps): React.ReactElement => {
    const userInfo = useAppSelector(({ login }) => login.userInfo)
    const dispatch = useAppDispatch()

    const [ navigate, setNavigate ] = useState(false)
    const [ showModal, setShowModal ] = useState(false)
    const [ oldPass, setOldPass ] = useState('')
    const [ newPass, setNewPass ] = useState('')
    const [ newPassRep, setNewPassRep ] = useState('')
    const [ newPassErr, setNewPassErr ] = useState(false)

    const onSubmit = useCallback(async () => {
        if (newPass !== newPassRep) {
            setNewPassErr(true)
        } else {
            const res = await changePassword(userInfo.id, oldPass, newPass)
            if (res.error) {
                dispatch(setToast({ message: res.message, error: true }))
            } else {
                dispatch(setToast({ message: res.message, error: false }))
                setOldPass('')
                setNewPass('')
                setNewPassRep('')
                setShowModal(false)
            }
        }
    }, [newPass, newPassRep, userInfo.id, oldPass, dispatch])

    if (navigate) {
        return <Navigate to={'/login'} replace/>
    }

    return <div className={'menu-bar'}>

        {showModal && <div className={'menu-bar__change-password'}>
            <div className={'menu-bar__change-password-inner'}>
                <input
                    type={'password'}
                    placeholder={'Old password'}
                    value={oldPass}
                    onChange={({ target: { value } }) => setOldPass(value)}
                />
                <input
                    type={'password'}
                    className={newPassErr ? 'input-error' : ''}
                    placeholder={'New password'}
                    value={newPass}
                    onChange={({ target: { value } }) => {
                        setNewPass(value)
                        newPassErr && setNewPassErr(false)
                    }}
                />
                <input
                    type={'password'}
                    className={newPassErr ? 'input-error' : ''}
                    placeholder={'Repeat new password'}
                    value={newPassRep}
                    onChange={({ target: { value } }) => {
                        setNewPassRep(value)
                        newPassErr && setNewPassErr(false)
                    }}
                />
                <div className={'menu-bar__footer'}>
                    <button onClick={() => onSubmit()}>Submit</button>
                    <button onClick={() => setShowModal(false)} className={'menu-bar__cancel-button'}>Cancel</button>
                </div>
            </div>
        </div>}

        <div className={'menu-bar__menu-item menu-bar__account'}>
            <i className="fas fa-user"/>
            {userInfo.name}
            <i className="fas fa-angle-down"/>
            <div className={'menu-bar__menu-item-dropdown'}>
                <span>Your bands:</span>
                {userInfo.bands.map((it) => (<span style={{ color: it.band_color }}>{it.band_name}</span>))}
                <button onClick={() => setShowModal(true)}>Change password</button>
                <button onClick={() => {
                    localStorage.removeItem('loginInfo')
                    setNavigate(true)
                }}>
                    Log out
                </button>
            </div>
        </div>
        <Link to={'/main'} replace className={'menu-bar__menu-item menu-bar__navigation'}>
            Calendar
        </Link>
        <Link to={'/main/info'} replace className={'menu-bar__menu-item menu-bar__navigation'}>
            Info
        </Link>
        <Link to={'/main/stuff'} replace className={'menu-bar__menu-item menu-bar__navigation'}>
            Stuff
        </Link>
        <div className={'menu-bar__menu-item menu-bar__update-calendar'} onClick={() => updateCalendar()} title={'Update calendar'}>
            <i className="fas fa-sync-alt"/>
        </div>
    </div>
}

export default MenuBar
