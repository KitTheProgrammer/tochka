const { getEventsByDate } = require('../dbApi')

const checkEventConflicts = async (date, startAt, endAt, id=null) => {
    const dbRes = await getEventsByDate(date)
    const initStartAtNumber = new Date(startAt).getTime()
    const initEndAtNumber = new Date(endAt).getTime()
    // console.log('1', dbRes, initStartAtNumber, initEndAtNumber)

    if (dbRes && dbRes.length) {
        for (let i = 0; i < dbRes.length; i++) {
            const it = dbRes[i]
            if (id !== it.id) {
                const startAtNumber = new Date(it.start_at).getTime()
                const endAtNumber = new Date(it.end_at).getTime()
                // console.log('2', initStartAtNumber, startAtNumber, initEndAtNumber, endAtNumber)
                // console.log('3', startAt, endAt, it.start_at, it.end_at)
                if ((
                        (initStartAtNumber > startAtNumber && initStartAtNumber < endAtNumber) ||
                        (initEndAtNumber > startAtNumber && initEndAtNumber < endAtNumber)
                    ) ||
                    (
                        (initStartAtNumber <= startAtNumber && initEndAtNumber >= endAtNumber)
                    )) {
                    return { isConflict: true, conflictSummary: it.summary }
                }
            }
        }
    } else {
        return { isConflict: false }
    }
    return { isConflict: false }
}

module.exports = {
    checkEventConflicts
}
