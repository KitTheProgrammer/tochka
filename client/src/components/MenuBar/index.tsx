import React from 'react'
import './styles/styles.css'
import { UserInfo } from '../../redux/reducers/login'

export interface MenuBarProps {
    userInfo: UserInfo

}

const MenuBar = (props: MenuBarProps): React.ReactElement => {
    const { userInfo } = props
    return <div className={'menu-bar'}>
        <div className={'menu-bar__menu-item menu-bar__account'}>
            {userInfo.name}
            {userInfo.roleId}
            {userInfo.bands.map((it) => (<span>{it.band_name};</span>))}
        </div>
    </div>
}

export default MenuBar
