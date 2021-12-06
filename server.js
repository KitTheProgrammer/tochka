const express = require('express');
const bodyParser = require('body-parser');
const {
    getUserBands,
    getLogin,
    getBands,
    getRoles,
    getCalendar,
    getEventById,
    getPersonById,
    setEventStatus, updateEvent, deleteEvent,
} = require('./dbApi')

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' })
})

app.get('/api/roles', async (req, res) => {
    try {
        const dbRes = await getRoles()
        res.send({
            error: false,
            message: null,
            payload: dbRes,
        })
    } catch (e) {
        res.send({
            error: true,
            message: `Internal server error at /api/roles: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.get('/api/bands', async (req, res) => {
    try {
        const dbRes = await getBands()
        res.send({
            error: false,
            message: null,
            payload: dbRes,
        })
    } catch (e) {
        res.send({
            error: true,
            message: `Internal server error at /api/bands: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.post('/api/login', async ({ body }, res) => {
    try {
        if (body) {
            const { login, password } = body
            if (login && password) {
                const dbRes = await getLogin(login, password)

                if (dbRes) {
                    res.send({
                        error: false,
                        message: null,
                        payload: dbRes,
                    })
                } else {
                    res.send({
                        error: true,
                        message: 'Login and/or password are incorrect!\nContact Kit if you think it is wrong.',
                        payload: null,
                    })
                }
            } else {
                res.send({
                    error: true,
                    message: 'Provide login and password!',
                    payload: null,
                })
            }
        }
    } catch (e) {
        res.send({
            error: true,
            message: `Internal server error at /api/login: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.post('/api/userBands', async ({ body }, res) => {
    try {
        const { userId } = body

        if (userId) {
            const dbRes = await getUserBands(userId)

            if (!dbRes) {
                res.send({
                    error: true,
                    message: `Something went wrong.(((\nContact Kit.`
                })
            } else {
                res.send({
                    error: false,
                    message: null,
                    payload: dbRes,
                })
            }
        }
    } catch (e) {
        res.send({
            error: true,
            message: `Internal server error at /api/userBands: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.get('/api/calendar', async (req, res) => {
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
})

app.post('/api/getPerson', async ({ body: { personId } }, res) => {
    try {
        if (personId) {
            const dbRes = getPersonById(personId)

            if (dbRes) {
                res.send({
                    error: false,
                    message: null,
                    payload: dbRes,
                })
            } else {
                res.send({
                    error: true,
                    message: `Internal server error at /api/getPerson: no such person.\nContact Kit.`,
                    payload: null,
                })
            }
        } else {
            res.send({
                error: true,
                message: `Request error to /api/getPerson: no id provided.\nContact Kit.`,
                payload: null,
            })
        }
    } catch (e) {
        res.send({
            error: true,
            message: `Internal server error at /api/getPerson: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.post('/api/useEvent', async ({ body: { eventId, userId } }, res) => {
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
})

app.post('/api/setEventStatus', async ({ body }, res) => {
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
})

app.post('/api/updateEvent', async ({ body }, res) => {
    try {
        const { id, startAt, endAt, summary, color, blocked_by, individual, band_id } = body
        const updatedAt = new Date().toISOString()
        console.log(body)
        const dbRes = await updateEvent(id, startAt, endAt, summary, color, updatedAt, blocked_by, individual, band_id)

        if (dbRes) {
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
    } catch (e) {
        console.log(e)
        res.send({
            error: true,
            message: `Internal server error at /api/updateEvent: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.post('/api/deleteEvent', async ({ body }, res) => {
    try {
        const { eventId } = body

        const dbRes = await deleteEvent(eventId)

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
})

app.listen(port, () => console.log(`Listening on port ${port}`))
