import React, { useCallback, useEffect } from 'react'
import './styles/styles.css'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { getAllStuff } from '../../api'
import { setToast } from '../../redux/reducers/toast'
import { setStuff } from '../../redux/reducers/stuff'
import StuffModal from '../StuffModal'
import { setShowStuffModal, setStuffInfo } from '../../redux/reducers/stuffModalController'
import { Stuff as StuffInt } from '../../types'

export interface StuffProps {
    updateStuff: () => void
}

export const Stuff = (props: StuffProps): React.ReactElement => {
    const { updateStuff } = props

    const dispatch = useAppDispatch()
    const stuff = useAppSelector(({ stuff }) => stuff.data)
    const userId = useAppSelector(({ login }) => login.userInfo.id)
    const userName = useAppSelector(({ login }) => login.userInfo.name)

    useEffect(() => {
        if (!stuff || !stuff.length) {
            updateStuff()
        }
    }, [stuff, updateStuff])

    const openModal = useCallback((data?: StuffInt) => {
        if (data) {
            dispatch(setStuffInfo(data))
            dispatch(setShowStuffModal({ isNew: false, showModal: true }))
        } else {
            dispatch(setStuffInfo({
                name: '',
                acceptable_users: [],
                created_by_id: userId,
                used_by: [],
                created_by: userName || '',
                available: true,
            }))
            dispatch(setShowStuffModal({ isNew: true, showModal: true }))
        }
    }, [dispatch, userId, userName])

    return <div className={'stuff-container'}>
        <StuffModal updateStuff={updateStuff}/>
        <div className={'stuff-table'}>
            <div className={'stuff-table__item stuff-table__header stuff-table__id'}>ID</div>
            <div className={'stuff-table__item stuff-table__header'}>Name</div>
            <div className={'stuff-table__item stuff-table__header'}>Created by</div>
            <div className={'stuff-table__item stuff-table__header'}>Can be used by</div>
            <div className={'stuff-table__item stuff-table__header'}>Used by</div>
            <div className={'stuff-table__item stuff-table__header'}>Edit</div>
            {stuff.map((it, ind) => {
                return <>
                    <div className={'stuff-table__item stuff-table__id'}>
                        {ind + 1}
                    </div>
                    <div className={'stuff-table__item stuff-table__name'}>
                        {it.name}
                    </div>
                    <div className={'stuff-table__item stuff-table__creator'}>
                        {it.created_by}
                    </div>
                    <div
                        className={'stuff-table__item stuff-table__can-use'}
                        style={{
                            backgroundColor: !it.available
                                ? 'red'
                                : it.acceptable_users.includes('all')
                                    ? 'green'
                                    : 'blue'
                        }}
                    >
                        {it.acceptable_users.map((it) => `${it}; `)}
                    </div>
                    <div className={'stuff-table__item stuff-table__users'}>
                        {it.used_by.map((it) => `${it}; `)}
                    </div>
                    <div className={'stuff-table__item'}>
                        <button onClick={() => openModal(it)} disabled={it.created_by_id !== userId}>Edit</button>
                    </div>
                </>
            })}
            <button onClick={() => openModal()}><i className="fas fa-plus"/></button>
        </div>
    </div>
}

export default Stuff
