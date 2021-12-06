import React  from 'react'
import './styles/styles.css'
import { useAppSelector } from '../../hooks'

export interface MenuBarProps {
    updateCalendar: () => void
}

const MenuBar = ({ updateCalendar }: MenuBarProps): React.ReactElement => {
    const userInfo = useAppSelector(({ login }) => login.userInfo)

    return <div className={'menu-bar'}>
        <div className={'menu-bar__menu-item menu-bar__account'}>
            {userInfo.name}
            {userInfo.roleId}
            {userInfo.bands.map((it) => (<span>{it.band_name};</span>))}
        </div>
        <div onClick={() => updateCalendar()}>Update calendar</div>
    </div>
}

export default MenuBar
