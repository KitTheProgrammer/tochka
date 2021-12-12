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
    setEventStatus, updateEvent, deleteEvent, createEvent, getUserPassword, updateUserPassword, getAllStuff,
    getStuffById, updateStuff, deleteStuff, createStuff, getAllUsers,
} = require('./dbApi')
const { checkEventConflicts } = require('./helpers/helpers')

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
            const dbRes = await updateEvent(id, startAt, endAt, summary, color, updatedAt, blocked_by, individual, band_id)
            console.log(dbRes)

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

app.post('/api/createEvent', async ({ body }, res) => {
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
})

app.post('/api/changePassword', async ({ body }, res) => {
    try {
        const { userId, oldPass, newPass } = body
        if (userId && oldPass && newPass) {
            const userPasswordRes = await getUserPassword(userId)

            if (userPasswordRes) {
                if (userPasswordRes.password === oldPass) {
                    const dbRes = await updateUserPassword(userId, newPass)

                    if (dbRes) {
                        res.send({
                            error: false,
                            message: 'Changed successfully!',
                            payload: dbRes,
                        })
                    } else {
                        console.log(dbRes)
                        res.send({
                            error: true,
                            message: `Internal server error at /api/changePassword.\nContact Kit.`,
                            payload: null,
                        })
                    }
                } else {
                    res.send({
                        error: true,
                        message: `Request error at /api/changePassword: incorrect password.\nContact Kit if you think this is wrong.`,
                        payload: null,
                    })
                }
            } else {
                res.send({
                    error: true,
                    message: `Internal server error at /api/changePassword: can't find user.\nContact Kit.`,
                    payload: null,
                })
            }
        } else {
            res.send({
                error: true,
                message: `Request error to /api/changePassword: parameter is missing.\nContact Kit.`,
                payload: null,
            })
        }
    } catch (e) {
        console.log(e)
        res.send({
            error: true,
            message: `Internal server error at /api/changePassword: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.get('/api/getAllStuff', async (req, res) => {
    try {
        const dbRes = await getAllStuff()
        if (dbRes) {
            res.send({
                error: false,
                message: 'Success!',
                payload: dbRes,
            })
        } else {
            console.log(dbRes)
            res.send({
                error: true,
                message: `Internal server error at /api/getAllStuff.\nContact Kit.`,
                payload: null,
            })
        }
    } catch (e) {
        console.log(e)
        res.send({
            error: true,
            message: `Internal server error at /api/getAllStuff: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.post('/api/getStuffById', async ({ body }, res) => {
    try {
        const { stuffId } = body
        if (stuffId) {
            const dbRes = await getStuffById(stuffId)

            if (dbRes) {
                res.send({
                    error: false,
                    message: 'Success!',
                    payload: dbRes,
                })
            } else {
                res.send({
                    error: true,
                    message: `Internal server error at /api/getStuffById: can't find stuff.\nContact Kit.`,
                    payload: null,
                })
            }
        } else {
            res.send({
                error: true,
                message: `Request error to /api/getStuffById: parameter is missing.\nContact Kit.`,
                payload: null,
            })
        }
    } catch (e) {
        console.log(e)
        res.send({
            error: true,
            message: `Internal server error at /api/getStuffById: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.post('/api/updateStuff', async ({ body }, res) => {
    try {
        const {id, name, used_by, acceptable_users, available} = body

        if (id && name && used_by && acceptable_users) {
            const dbRes = await updateStuff(id, name, used_by, acceptable_users, available)

            if (dbRes) {
                res.send({
                    error: false,
                    message: 'Updated successfully!',
                    payload: dbRes,
                })
            } else {
                res.send({
                    error: true,
                    message: `Internal server error at /api/updateStuff.\nContact Kit.`,
                    payload: null,
                })
            }
        } else {
            res.send({
                error: true,
                message: `Request error to /api/updateStuff: parameter is missing.\nContact Kit.`,
                payload: null,
            })
        }
    } catch (e) {
        console.log(e)
        res.send({
            error: true,
            message: `Internal server error at /api/updateStuff: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.post('/api/createStuff', async ({ body }, res) => {
    try {
        const {name, created_by_id : created_by, used_by, acceptable_users, available} = body

        if (name && created_by && used_by && acceptable_users) {
            const dbRes = await createStuff(name, created_by, used_by, acceptable_users, available)

            if (dbRes) {
                res.send({
                    error: false,
                    message: 'Updated successfully!',
                    payload: dbRes,
                })
            } else {
                res.send({
                    error: true,
                    message: `Internal server error at /api/createStuff.\nContact Kit.`,
                    payload: null,
                })
            }
        } else {
            res.send({
                error: true,
                message: `Request error to /api/createStuff: parameter is missing.\nContact Kit.`,
                payload: null,
            })
        }
    } catch (e) {
        console.log(e)
        res.send({
            error: true,
            message: `Internal server error at /api/createStuff: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.post('/api/deleteStuff', async ({ body }, res) => {
    try {
        const { stuffId } = body

        const dbRes = await deleteStuff(stuffId)

        res.send({
            error: false,
            message: 'Deleted successfully!',
            payload: dbRes,
        })
    } catch (e) {
        console.log(e)
        res.send({
            error: true,
            message: `Internal server error at /api/deleteStuff: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.get('/api/getAllUsers', async (req, res) => {
    try {
        const dbRes = await getAllUsers()
        if (dbRes) {
            res.send({
                error: false,
                message: 'Success!',
                payload: dbRes,
            })
        } else {
            console.log(dbRes)
            res.send({
                error: true,
                message: `Internal server error at /api/getAllUsers.\nContact Kit.`,
                payload: null,
            })
        }
    } catch (e) {
        console.log(e)
        res.send({
            error: true,
            message: `Internal server error at /api/getAllUsers: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.listen(port, () => console.log(`Listening on port ${port}`))
