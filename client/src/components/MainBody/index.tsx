import React, { useCallback } from 'react'
import Calend from 'calend'
import { CALENDAR_VIEW } from 'calend/common/enums'

import './styles/styles.css'
import 'calend/styles/index.css'
import EventModal from '../EventModal'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setEventInfo, setShowEventModal } from '../../redux/reducers/eventModalController'
import { checkEventUsage, setEventStatus } from '../../api'
import { CalendarEvent } from '../../types'
import { setToast } from '../../redux/reducers/toast'
import { NewEventClickData } from 'calend/common/interface'
import { setHoursToDate } from '../../utils/helpers'

export interface MainBodyProps {
    updateCalendar: () => void
}

const MainBody = ({ updateCalendar }: MainBodyProps): React.ReactElement => {
    const dispatch = useAppDispatch()
    const calendarData = useAppSelector(({ calendar: { data } }) => data)
    const currUserId = useAppSelector(({ login }) => login.userInfo.id)
    const currUserName = useAppSelector(({ login }) => login.userInfo.name)

    const onEventClick = useCallback(async (event: CalendarEvent) => {
        const res = await checkEventUsage(event.id, currUserId)

        if (res.error) {
            dispatch(setToast({ message: res.message, error: true }))
        } else {
            const setEventStatusRes = await setEventStatus(currUserId, true, event.id)

            if (setEventStatusRes.error) {
                dispatch(setToast({ message: setEventStatusRes.message, error: true }))
            } else {
                dispatch(setEventInfo(event))
                dispatch(setShowEventModal({ showModal: true, isNew: false }))
            }
        }
    }, [dispatch, currUserId])

    const onNewEventClick = useCallback( (event: NewEventClickData) => {
        if (Number(event.hour.toFixed(0)) === 23) {
            dispatch(setToast({ message: 'Can\'t create event at 23:00, sorry((((', error: true }))
        } else {
            const startAt = setHoursToDate(event.day.toISOString(), event.hour.toFixed(0))
            const endAt = setHoursToDate(event.day.toISOString(), Number(event.hour.toFixed(0)) + 1)
            const summary = 'New Event'
            const color = 'black'
            const created_by = currUserName
            const individual = true
            const eventInfo = {
                startAt, endAt, summary, color, created_by, individual, id: 10000000000,
                date: event.day.toISOString().split('T')[0].split('-').reverse().join('-')
            }
            dispatch(setEventInfo(eventInfo))
            dispatch(setShowEventModal({ showModal: true, isNew: true }))
        }
    }, [dispatch])

    console.log(calendarData)

    return <div className={'main-body'}>
        <EventModal updateCalendar={updateCalendar}/>
        <Calend
            initialView={CALENDAR_VIEW.WEEK}
            initialDate={new Date().toISOString()}
            hourHeight={60}
            events={calendarData}
            onNewEventClick={(e) => {
                console.log('newEvent', e)
                onNewEventClick(e)
            }}
            onEventClick={(e) => {
                console.log('oldEvent', e)
                onEventClick(e).catch((e) => dispatch(setToast({ message: `Error on event click: ${e}`, error: true })))
            }}
        />
    </div>
}

export default MainBody
