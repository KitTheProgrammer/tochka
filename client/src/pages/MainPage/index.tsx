import React from 'react'
import MenuBar from '../../components/MenuBar'
import { useAppSelector } from '../../hooks'
import MainBody from '../../components/MainBody'

const MainPage = (): React.ReactElement => {
    const userInfo = useAppSelector(({ login }) => login.userInfo)

    return <>
        <MenuBar userInfo={userInfo}/>
        <MainBody/>
    </>
}

export default MainPage
