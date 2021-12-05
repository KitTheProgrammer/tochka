import React from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { setShowEventModal } from '../../redux/reducers/eventModalController'

import './styles/styles.css'

export interface EventModalProps {

}

const EventModal = (props: EventModalProps): React.ReactElement => {
    const dispatch = useAppDispatch()
    const showEventModal = useAppSelector(({ eventModalController }) => eventModalController.showModal)

    return <>
        {(showEventModal) && <div className={'event-modal'}>
            <div className={'event-modal__modal-inner'}>
                <span onClick={() => dispatch(setShowEventModal(false))}>Close</span>
            </div>
        </div>}
    </>
}

export default EventModal
