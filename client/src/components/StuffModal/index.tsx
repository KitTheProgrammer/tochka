import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setShowStuffModal, setStuffInfoParameter } from '../../redux/reducers/stuffModalController'

import './styles/styles.css'
import { createStuff, deleteStuff, updateStuff } from '../../api'
import { setToast } from '../../redux/reducers/toast'

export interface StuffModalProps {
    updateStuff: () => void
}

const StuffModal = (props: StuffModalProps): React.ReactElement => {
    const { updateStuff: refreshStuff } = props

    const dispatch = useAppDispatch()
    const showModal = useAppSelector(({ stuffModalController }) => stuffModalController.showModal)
    const isNew = useAppSelector(({ stuffModalController }) => stuffModalController.isNew)
    const stuffInfo = useAppSelector(({ stuffModalController }) => stuffModalController.stuffInfo)
    const allUsers = useAppSelector(({ login }) => login.allUsers)

    const closeModal = useCallback(() => {
        dispatch(setShowStuffModal({ showModal: false }))
    }, [dispatch])

    const handleInputChange = useCallback((key, value) => {
        dispatch(setStuffInfoParameter({ key, value }))
    }, [dispatch])

    const handleSubmit = useCallback(async () => {
        if (isNew) {
            const res = await createStuff(stuffInfo)
            if (res.error) {
                dispatch(setToast({ message: res.message, error: true }))
            } else {
                dispatch(setToast({ message: res.message, error: false }))
                closeModal()
                refreshStuff()
            }
        } else {
            const res = await updateStuff(stuffInfo)
            if (res.error) {
                dispatch(setToast({ message: res.message, error: true }))
            } else {
                dispatch(setToast({ message: res.message, error: false }))
                closeModal()
                refreshStuff()
            }
        }
    }, [closeModal, dispatch, isNew, refreshStuff, stuffInfo])

    const handleDelete = useCallback(async () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm(`Are you sure you want to delete "${stuffInfo?.name}" event?`)) {
            const res = await deleteStuff(stuffInfo?.id)
            if (res.error) {
                dispatch(setToast({ message: res.message, error: true }))
            } else {
                dispatch(setToast({ message: res.message, error: false }))
                closeModal()
                refreshStuff()
            }
        }
    }, [closeModal, dispatch, refreshStuff, stuffInfo?.id, stuffInfo?.name])

    return <>
        {showModal && <div className={'stuff-modal'}>
            <div className={'stuff-modal__modal-inner'}>
                <div className={'stuff-modal_modal-header'}>
                    {(isNew) ? 'Create stuff' : 'Edit stuff'}
                    <button onClick={closeModal}>Close</button>
                </div>
                <div className={'stuff-modal__modal-body'}>
                    <span>Name:</span>
                    <textarea
                        value={stuffInfo?.name}
                        onChange={({ target: { value } }) => handleInputChange('name', value)}
                    />
                    <span>
                        Can be used by:
                        {stuffInfo?.acceptable_users?.map((it) => (
                            <span
                                key={it}
                                title={`Delete ${it}`}
                                onClick={() =>
                                    handleInputChange('acceptable_users', stuffInfo?.acceptable_users.filter((it1) => it1 !== it))}
                            > {it};</span>
                        ))}
                    </span>
                    <select
                        multiple
                        onChange={({ target: { value } }) => {
                            if (value === 'all') {
                                handleInputChange('acceptable_users', ['all'])
                            } else {
                                handleInputChange('acceptable_users', [ ...stuffInfo?.acceptable_users || [], value])
                            }
                        }}
                        disabled={stuffInfo?.acceptable_users.includes('all')}
                    >
                        <option value={'all'}>
                            all
                        </option>
                        {allUsers.filter((it) => !stuffInfo?.acceptable_users.includes(it.display_name)).map((it) => (
                            <option
                                value={it.display_name}
                                key={it.id}
                            >
                                {it.display_name}
                            </option>
                        ))}
                    </select>
                    <span>
                        Used by:
                        {stuffInfo?.used_by?.map((it) => (
                            <span
                                key={it}
                                title={`Delete ${it}`}
                                onClick={() =>
                                    handleInputChange('used_by', stuffInfo?.used_by.filter((it1) => it1 !== it))}
                            > {it};</span>
                        ))}
                    </span>
                    <select
                        multiple
                        onChange={({ target: { value } }) => {
                            if (value === 'all') {
                                handleInputChange('used_by', ['all'])
                            } else {
                                handleInputChange('used_by', [ ...stuffInfo?.used_by || [], value])
                            }
                        }}
                        disabled={stuffInfo?.used_by.includes('all')}
                    >
                        <option value={'all'}>
                            all
                        </option>
                        {allUsers.filter((it) => !stuffInfo?.used_by.includes(it.display_name)).map((it) => (
                            <option
                                value={it.display_name}
                                key={it.id}
                            >
                                {it.display_name}
                            </option>
                        ))}
                    </select>
                    <div className={'stuff-modal__form-block'}>
                        <span>Available:</span>
                        <input
                            type={'checkbox'}
                            checked={stuffInfo?.available}
                            onChange={() => handleInputChange('available', !stuffInfo?.available)}
                        />
                    </div>
                </div>
                <div className={'stuff-modal__footer'}>
                    <button
                        className={'stuff-modal__submit-button stuff-modal__form-button'}
                        onClick={handleSubmit}
                    >
                        {(isNew) ? 'Create' : 'Update'}
                    </button>
                    {(!isNew) && <button
                        className={'stuff-modal__delete-button stuff-modal__form-button'}
                        onClick={handleDelete}
                    >
                        Delete
                    </button>}
                </div>
            </div>
        </div>}
    </>
}

export default StuffModal
