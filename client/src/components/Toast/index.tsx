import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks'

import './styles/styles.css'
import { unsetToast } from '../../redux/reducers/toast'

const Toast = (): React.ReactElement => {
    const dispatch = useAppDispatch()

    const message = useAppSelector(({ toast }) => toast.message)
    const error = useAppSelector(({ toast }) => toast.error)
    const showToast = useAppSelector(({ toast }) => toast.showToast)

    useEffect(() => {
        if (showToast) {
            setTimeout(() => dispatch(unsetToast()), 5000)
        }
    }, [dispatch, showToast])

    return <>
        {showToast && <div className={`toast ${error ? 'error' : ''}`}>
            <span>{message}</span>
        </div>}
    </>
}

export default Toast
