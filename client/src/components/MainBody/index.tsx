import React from 'react'
import Calend from 'calend'
import { CALENDAR_VIEW } from 'calend/common/enums'

import './styles/styles.css'
import 'calend/styles/index.css'
import EventModal from '../EventModal'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setShowEventModal } from '../../redux/reducers/eventModalController'

export interface MainBodyProps {

}

const MainBody = (props: MainBodyProps): React.ReactElement => {
    const dispatch = useAppDispatch()
    const calendarData = useAppSelector(({ calendar: { data } }) => data)

    console.log(calendarData)

    return <div className={'main-body'}>
        <EventModal/>
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
                dispatch(setShowEventModal(true))
            }}
        />
    </div>
}

export default MainBody
