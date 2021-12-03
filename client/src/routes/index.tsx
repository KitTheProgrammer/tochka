import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'
import MainPage from '../pages/MainPage'
import LoginPage from '../pages/LoginPage'

const DefaultRouter = (): React.ReactElement => {
    return <Router>
        <Routes>
            <Route path={'/login'} element={<LoginPage/>} />
            <Route path={'/main'} element={<MainPage/>}/>
            <Route path={'/'} element={<Navigate to={'./login'}/>}/>
        </Routes>
    </Router>
}

export default DefaultRouter
