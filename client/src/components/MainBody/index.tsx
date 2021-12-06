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

export interface MainBodyProps {
    updateCalendar: () => void
}

const MainBody = ({ updateCalendar }: MainBodyProps): React.ReactElement => {
    const dispatch = useAppDispatch()
    const calendarData = useAppSelector(({ calendar: { data } }) => data)
    const currUserId = useAppSelector(({ login }) => login.userInfo.id)

    const onEventClick = useCallback(async (event: CalendarEvent) => {
        const res = await checkEventUsage(event.id, currUserId)

        if (res.error) {
            dispatch(setToast({ message: res.message, error: true }))
        } else {
            console.log('hey', event)
            const setEventStatusRes = await setEventStatus(currUserId, true, event.id)

            if (setEventStatusRes.error) {
                dispatch(setToast({ message: setEventStatusRes.message, error: true }))
            } else {
                dispatch(setEventInfo(event))
                dispatch(setShowEventModal(true))
            }
        }
    }, [dispatch, currUserId])

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
                dispatch(setShowEventModal(true))
            }}
            onEventClick={(e) => {
                console.log('oldEvent', e)
                onEventClick(e).catch((e) => dispatch(setToast({ message: `Error on event click: ${e}`, error: true })))
            }}
        />
    </div>
}

export default MainBody
