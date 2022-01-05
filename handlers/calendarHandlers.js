const {
  getCalendar,
  getEventById,
  getUserBands,
  setEventStatus,
  updateEvent,
  getPersonById,
  getBandUsers,
  deleteEvent,
  createEvent,
  getBandById,
} = require('../dbApi')
const { checkEventConflicts, getDate } = require('../helpers/helpers')
const bot = require('../tgBot')

const getCalendarHandler = async (req, res) => {
  try {
    const dbRes = await getCalendar()

    res.send({
      error: false,
      message: null,
      payload: dbRes,
    })
  } catch (e) {
    res.send({
      error: true,
      message: `Internal server error at /api/calendar: ${e}.\nContact Kit.`,
      payload: null,
    })
  }
}

const useEventHandler = async ({ body: { eventId, userId } }, res) => {
  try {
    if (eventId && userId) {
      const dbRes = await getEventById(eventId)

      if (dbRes.blocked && dbRes.blocked_by_id !== userId) {
        res.send({
          error: true,
          message: `DB error: this event is currently in use by ${dbRes.blocked_by}.\nContact Kit if you think it's wrong.`,
          payload: null,
        })
      } else {
        if (dbRes.individual) {
          if (dbRes.created_by_id === userId) {
            res.send({
              error: false,
              message: null,
              payload: dbRes,
            })
          } else {
            res.send({
              error: true,
              message: `You are not a creator of this event.\nContact Kit if you think this is wrong.`,
              payload: null,
            })
          }
        } else {
          const userReqBandsRes = await getUserBands(userId)
          if (userReqBandsRes.some((it) => it.id === dbRes.band_id)) {
            res.send({
              error: false,
              message: null,
              payload: dbRes,
            })
          } else {
            res.send({
              error: true,
              message: `You are not a part of this band.\nContact Kit if you think this is wrong.`,
              payload: null,
            })
          }
        }
      }
    } else {
      res.send({
        error: true,
        message: `Request error to /api/useEvent: no id provided.\nContact Kit.`,
        payload: null,
      })
    }
  } catch (e) {
    res.send({
      error: true,
      message: `Internal server error at /api/useEvent: ${e}.\nContact Kit.`,
      payload: null,
    })
  }
}

const setEventStatusHandler = async ({ body }, res) => {
  try {
    const { userId, status, eventId } = body

    if (userId && eventId) {
      const currDate = new Date()
      const dbRes = await setEventStatus(eventId, status, userId, currDate.toISOString())

      if (dbRes) {
        res.send({
          error: false,
          message: 'Updated successfully!',
          payload: dbRes,
        })
      } else {
        res.send({
          error: true,
          message: `Internal server error at /api/setEventStatus.\nContact Kit.`,
          payload: null,
        })
      }
    } else {
      res.send({
        error: true,
        message: `Request error to /api/setEventStatus: parameter is missing.\nContact Kit.`,
        payload: null,
      })
    }
  } catch (e) {
    console.log(e)
    res.send({
      error: true,
      message: `Internal server error at /api/setEventStatus: ${e}.\nContact Kit.`,
      payload: null,
    })
  }
}

const updateEventHandler = async ({ body }, res) => {
  try {
    const { id, startAt, endAt, summary, color, blocked_by, individual, band_id, date } = body

    if (new Date(endAt).getTime() <= new Date(startAt).getTime()) {
      res.send({
        error: true,
        message: `Invalid event time".\nContact Kit if you think it's wrong.`,
        payload: null,
      })
      return
    }

    const updatedAt = new Date().toISOString()
    const conflict = await checkEventConflicts(date, startAt, endAt, id)

    if (conflict.isConflict) {
      res.send({
        error: true,
        message: `Conflict with event "${conflict.conflictSummary}".\nContact Kit if you think it's wrong.`,
        payload: null,
      })
    } else {
      const oldEvent = await getEventById(id)
      const dbRes = await updateEvent(id, startAt, endAt, summary, color, updatedAt, blocked_by, individual, band_id)

      if (dbRes) {
        const userRes = await getPersonById(blocked_by)

        if (userRes) {
          const changedSum = (oldEvent.summary === summary) ? `"${summary}"` : `"${oldEvent.summary}" -> "${summary}"`
          const changedStartAt = (oldEvent.start_at === startAt) ? `${new Date(startAt).getHours()}:00` : `${new Date(oldEvent.start_at).getHours()}:00 -> ${new Date(startAt).getHours()}:00`
          const changedEndAt = (oldEvent.end_at === endAt) ? `${new Date(endAt).getHours()}:00` : `${new Date(oldEvent.end_at).getHours()}:00 -> ${new Date(endAt).getHours()}:00`
          const bandUsers = await getBandUsers(oldEvent.band_id)
          const notify = (bandUsers.length && !individual) ? '\nРебята, ' + bandUsers.reduce((ac, { tg_tag }) => ac + tg_tag + ' ', '') + 'учтите изменения!' : ''

          bot.telegram.sendMessage(chatId,
            `${userRes.tg_tag} только что изменил ивент ${changedSum}.\nДата: ${getDate(new Date(date))}\nНачало: ${changedStartAt}\nКонец: ${changedEndAt}${notify}`
          )
        }

        res.send({
          error: false,
          message: 'Updated successfully!',
          payload: dbRes,
        })
      } else {
        res.send({
          error: true,
          message: `Internal server error at /api/updateEvent.\nContact Kit.`,
          payload: null,
        })
      }
    }
  } catch (e) {
    console.log(e)
    res.send({
      error: true,
      message: `Internal server error at /api/updateEvent: ${e}.\nContact Kit.`,
      payload: null,
    })
  }
}

const deleteEventHandler = async ({ body }, res) => {
  try {
    const { eventId, userId } = body

    const oldEvent = await getEventById(eventId)
    const userRes = await getPersonById(userId)

    const dbRes = await deleteEvent(eventId)

    if (userRes && oldEvent) {
      const bandUsers = await getBandUsers(oldEvent.band_id)
      const notify = (bandUsers.length && !oldEvent.individual) ? '\nРебята, ' + bandUsers.reduce((ac, { tg_tag }) => ac + tg_tag + ' ', '') + 'репа отменяется!!!' : ''

      bot.telegram.sendMessage(chatId,
        `${userRes.tg_tag} только что удалил ивент "${oldEvent.summary}".\nДата: ${oldEvent.date.replace(/-/g, '.')}\nТеперь время с ${new Date(oldEvent.start_at).getHours()}:00 по ${new Date(oldEvent.end_at).getHours()}:00 свободно.${notify}`
      )
    }

    res.send({
      error: false,
      message: 'Deleted successfully!',
      payload: dbRes,
    })
  } catch (e) {
    console.log(e)
    res.send({
      error: true,
      message: `Internal server error at /api/deleteEvent: ${e}.\nContact Kit.`,
      payload: null,
    })
  }
}

const createEventHandler = async ({ body }, res) => {
  try {
    const { date, startAt, endAt, summary, color, created_by, individual, band_id, repeat } = body
    const currDate = new Date().toISOString()

    if (date && startAt && endAt && summary && color && created_by) {
      const correctedDate = date.split('T')[0].split('-').reverse().join('-')
      if (new Date(endAt).getTime() <= new Date(startAt).getTime()) {
        res.send({
          error: true,
          message: `Invalid event time.\nContact Kit if you think it's wrong.`,
          payload: null,
        })
        return
      }
      const conflict = await checkEventConflicts(correctedDate, startAt, endAt)
      if (conflict.isConflict) {
        res.send({
          error: true,
          message: `Conflict with event "${conflict.conflictSummary}".\nContact Kit if you think it's wrong.`,
          payload: null,
        })
      } else {
        const dbRes = await createEvent(correctedDate, startAt, endAt, summary, color, created_by, currDate, individual, band_id)
        if (dbRes) {
          const userRes = await getPersonById(created_by)
          const bandName = await getBandById(band_id)
          const bandUsers = await getBandUsers(band_id)

          if (userRes) {
            const isRepeatedText = (repeat) ? ' и повторил его на 4 недели вперед' : ''
            const isIndividualText = (individual) ? 'индивидуальный' : `групповой (${bandName.band_name || 'Err'})`
            const notify = (bandUsers.length && !individual) ? '\nРебята, ' + bandUsers.reduce((ac, { tg_tag }) => ac + tg_tag + ' ', '') + 'не пропустите репу!' : ''

            bot.telegram.sendMessage(chatId,
              `${userRes.tg_tag} только что создал новый ${isIndividualText} ивент "${summary}"${isRepeatedText}.\nДата: ${getDate(new Date(date))}\nНачало: ${new Date(startAt).getHours()}:00\nКонец: ${new Date(endAt).getHours()}:00${notify}`
            )
          }
          res.send({
            error: false,
            message: 'Created successfully!',
            payload: dbRes,
          })
        } else {
          console.log(dbRes)
          res.send({
            error: true,
            message: `Internal server error at /api/createEvent.\nContact Kit.`,
            payload: null,
          })
        }
        if (repeat) {
          for (let i = 1; i < 4; i++) {
            const hoursToAdd = 7 * 24 * i

            const correctedStartAt = new Date(startAt)
            correctedStartAt.setHours(hoursToAdd + correctedStartAt.getHours())
            const repStartAt = correctedStartAt.toISOString()

            const correctedEndAt = new Date(endAt)
            correctedEndAt.setHours(hoursToAdd + correctedEndAt.getHours())
            const repEndAt = correctedEndAt.toISOString()

            const correctedDateDate = new Date(correctedDate.split('-').reverse().join('-'))
            correctedDateDate.setHours(hoursToAdd + correctedStartAt.getHours())
            const repDate = correctedDateDate.toISOString().split('T')[0].split('-').reverse().join('-')

            await createEvent(repDate, repStartAt, repEndAt, summary + ' (repeated)', color, created_by, currDate, individual, band_id)
          }
        }
      }
    } else {
      res.send({
        error: true,
        message: `Request error to /api/createEvent: parameter is missing.\nContact Kit.`,
        payload: null,
      })
    }
  } catch (e) {
    console.log(e)
    res.send({
      error: true,
      message: `Internal server error at /api/createEvent: ${e}.\nContact Kit.`,
      payload: null,
    })
  }
}

module.exports = {
  getCalendarHandler,
  useEventHandler,
  setEventStatusHandler,
  updateEventHandler,
  deleteEventHandler,
  createEventHandler,
}
