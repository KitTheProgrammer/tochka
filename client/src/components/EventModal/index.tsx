import React, { useCallback, useMemo, useState } from 'react'
// @ts-ignore
import { SketchPicker } from 'react-color'

import { useAppDispatch, useAppSelector } from '../../hooks'
import { setEventInfoParameter, setShowEventModal } from '../../redux/reducers/eventModalController'

import './styles/styles.css'
import { createEvent, deleteEvent, setEventStatus, updateEvent } from '../../api'
import { setToast } from '../../redux/reducers/toast'
import { setHoursToDate } from '../../utils/helpers'

export interface EventModalProps {
    updateCalendar: () => void
}

const EventModal = ({ updateCalendar }: EventModalProps): React.ReactElement => {
    const dispatch = useAppDispatch()

    const showEventModal = useAppSelector(({ eventModalController }) => eventModalController.showModal)
    const isNewEvent = useAppSelector(({ eventModalController }) => eventModalController.isNew)
    const eventInfo = useAppSelector(({ eventModalController }) => eventModalController.eventInfo)
    const currUserId = useAppSelector(({ login }) => login.userInfo.id)
    const bands = useAppSelector(({ login }) => login.userInfo.bands)
    const userInfo = useAppSelector(({ login }) => login.userInfo)

    const [useName, setUseName] = useState(false)

    const closeModal = useCallback(async () => {
        if (isNewEvent) {
            // eslint-disable-next-line no-restricted-globals
            if (confirm('Are you sure? All data will be lost')) {
                dispatch(setShowEventModal({ showModal: false }))
            }
        } else {
            const res = await setEventStatus(currUserId, false, eventInfo?.id)
            if (res.error) {
                dispatch(setToast({ message: res.message, error: true }))
            } else {
                dispatch(setShowEventModal({ showModal: false }))
            }
        }
    }, [dispatch, eventInfo?.id, currUserId, isNewEvent])

    const handleInputChange = useCallback((key, value) => {
        dispatch(setEventInfoParameter({ key, value }))
    }, [dispatch])

    const submitEventPress = useCallback(async () => {
        if (new RegExp('[^0-9]').test(eventInfo?.startAt || 'a') ||
            new RegExp('[^0-9]').test(eventInfo?.endAt || 'a')) {
            dispatch(setToast({ message: 'Invalid input for event time', error: true }))
            return
        }
        if (isNewEvent) {
            console.log({
                ...eventInfo,
                created_by: userInfo.id,
                startAt: setHoursToDate(eventInfo?.date, eventInfo?.startAt || 0),
                endAt: setHoursToDate(eventInfo?.date, eventInfo?.endAt === '24' ? '23' : eventInfo?.endAt || 0, eventInfo?.endAt === '24'),
            })
            // @ts-ignore
            const res = await createEvent({
                ...eventInfo,
                created_by: userInfo.id,
                startAt: setHoursToDate(eventInfo?.date, eventInfo?.startAt || 0),
                endAt: setHoursToDate(eventInfo?.date, eventInfo?.endAt === '24' ? '23' : eventInfo?.endAt || 0, eventInfo?.endAt === '24'),
            })
            if (res.error) {
                dispatch(setToast({ message: res.message, error: true }))
            } else {
                dispatch(setShowEventModal({ showModal: false }))
                dispatch(setToast({ message: res.message, error: false }))
                updateCalendar()
            }
        } else {
            // @ts-ignore
            const res = await updateEvent({
                ...eventInfo,
                blocked_by: userInfo.id,
                startAt: setHoursToDate(eventInfo?.date, eventInfo?.startAt || 0),
                endAt: setHoursToDate(eventInfo?.date, eventInfo?.endAt === '24' ? '23' : eventInfo?.endAt || 0),
            })
            if (res.error) {
                dispatch(setToast({ message: res.message, error: true }))
            } else {
                dispatch(setShowEventModal({ showModal: false }))
                dispatch(setToast({ message: res.message, error: false }))
                updateCalendar()
            }
        }
    }, [dispatch, eventInfo, updateCalendar, userInfo.id, isNewEvent])

    const deleteEventPress = useCallback(async () => {
        // eslint-disable-next-line no-restricted-globals
        if (!isNewEvent && confirm(`Are you sure you want to delete "${eventInfo?.summary}" event?`)) {
            const res = await deleteEvent(eventInfo?.id)
            if (res.error) {
                dispatch(setToast({ message: res.message, error: true }))
            } else {
                dispatch(setShowEventModal({ showModal: false }))
                updateCalendar()
            }
        }
    }, [dispatch, eventInfo?.id, eventInfo?.summary, updateCalendar, isNewEvent])

    return <>
        {(showEventModal) && <div className={'event-modal'}>
            <div className={'event-modal__modal-inner'}>
                <div className={'event-modal__header'}>
                    <span>{isNewEvent ? 'New event' : `Update event ${eventInfo?.summary}`}</span>
                    <button onClick={() => closeModal()}>Close</button>
                </div>
                <div className={'event-modal__body'}>
                    <span>Start:</span>
                    <input
                        type={'text'}
                        min={0}
                        max={23}
                        pattern="\d*"
                        value={eventInfo?.startAt || ''}
                        onChange={({ target: { value } }) => {
                            const correctedValue = Number(value) < 0 ? '0' : Number(value) > 23 ? '23' : value
                            handleInputChange('startAt', correctedValue)
                        }}
                    />
                    <span>End:</span>
                    <input
                        type={'text'}
                        pattern="\d*"
                        value={eventInfo?.endAt || ''}
                        onChange={({ target: { value } }) => {
                            const correctedValue = Number(value) < 0 ? '0' : Number(value) > 24 ? '24' : value
                            handleInputChange('endAt', correctedValue)
                        }}
                    />
                    <span>Event name:</span>
                    <input
                        type={'text'}
                        value={eventInfo?.summary}
                        onChange={({ target: { value } }) => {
                            handleInputChange('summary', value)
                            setUseName(false)
                        }}
                    />
                    <div className={'event-modal__form-block'}>
                        <span>Use default event name:</span>
                        <input
                            type={'checkbox'}
                            name={'name'}
                            checked={useName}
                            onChange={() => {
                                if (eventInfo?.individual) {
                                    handleInputChange('summary', userInfo.name)
                                } else {
                                    handleInputChange('summary', bands.find((it) => it.id === eventInfo?.band_id)?.band_name)
                                }
                                setUseName(!useName)
                            }}
                        />
                    </div>
                    <div className={'event-modal__form-block'}>
                        Individual: <input
                            type={'checkbox'}
                            name={'Individual'}
                            disabled={!bands.length}
                            checked={eventInfo?.individual}
                            onChange={() => {
                                handleInputChange('individual', !eventInfo?.individual)
                                if (eventInfo?.individual) {
                                    handleInputChange('color', bands[0].band_color)
                                    handleInputChange('band_id', bands[0].id)
                                }
                                setUseName(false)
                            }}
                        />
                    </div>
                    <div className={'event-modal__form-block'}>
                        Color/Band: {(eventInfo?.individual || !bands.length)
                        ? <div className={'event-modal__color-picker'} style={{ backgroundColor: eventInfo?.color }}>
                            <div className={'event-modal__show-color-picker'}>
                                <SketchPicker
                                    onChangeComplete={({ hex }: any) => {
                                        handleInputChange('color', hex)
                                        handleInputChange('band_id', null)
                                    }}
                                    color={eventInfo?.color}
                                />
                            </div>
                        </div>
                        : <select
                            style={{ backgroundColor: eventInfo?.color }}
                            value={eventInfo?.band_id}
                            onChange={({ target: { value } }) => {
                                // @ts-ignore
                                const { band_color, id, band_name } = bands.find((it) => it.id === Number(value))
                                if (useName) {
                                    handleInputChange('summary', band_name)
                                }
                                handleInputChange('color', band_color)
                                handleInputChange('band_id', id)
                            }}
                        >
                            {bands.map((it) => {
                                return <option
                                    style={{ backgroundColor: it.band_color }}
                                    value={it.id}
                                >
                                    {it.band_name}
                                </option>
                            })}
                        </select>}
                    </div>
                    {isNewEvent && <div className={'event-modal__form-block'}>
                        Repeat (for 4 weeks):
                        <input
                            type={'checkbox'}
                            name={'repeat'}
                            checked={eventInfo?.repeat}
                            onChange={() => handleInputChange('repeat', !eventInfo?.repeat)}
                        />
                    </div>}
                    <div className={'event-modal__info-block'}>
                        <div>Created by: {eventInfo?.created_by}; </div>
                        <div>{eventInfo?.blocked_by && `Last updated by: ${eventInfo?.blocked_by};`} </div>
                        <div>
                            {eventInfo?.updated_at &&
                                `Last updated at: ${new Date(eventInfo?.updated_at || 0).toLocaleString()}`}
                        </div>
                    </div>
                </div>
                <div className={'event-modal__footer'}>
                    <button
                        className={'event-modal__submit-button event-modal__form-button'}
                        onClick={submitEventPress}
                    >
                        {(isNewEvent) ? 'Create' : 'Update'}
                    </button>
                    {(!isNewEvent) && <button
                        className={'event-modal__delete-button event-modal__form-button'}
                        onClick={deleteEventPress}
                    >
                        Delete
                    </button>}
                </div>
            </div>
        </div>}
    </>
}

export default EventModal
