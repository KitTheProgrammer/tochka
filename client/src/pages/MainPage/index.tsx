import React from 'react'
import { Link } from 'react-router-dom'

const MainPage = (): React.ReactElement => {
    return <div>
        <span>main</span>
        <Link to={'/login'}>to login</Link>
    </div>
}

export default MainPage
