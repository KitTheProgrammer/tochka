const express = require('express');
const bodyParser = require('body-parser');
const { getUserBands, getLogin, getBands, getRoles, getCalendar, getEventById, getPersonById } = require('./dbApi')

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
            message: `Internal server error: ${e}.\nContact Kit.`,
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
            message: `Internal server error: ${e}.\nContact Kit.`,
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
            message: `Internal server error: ${e}.\nContact Kit.`,
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
            message: `Internal server error: ${e}.\nContact Kit.`,
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
            message: `Internal server error: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.get('/api/getPerson', async ({ body: { personId } }, res) => {
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
                    message: `Internal server error: no such person.\nContact Kit.`,
                    payload: null,
                })
            }
        } else {
            res.send({
                error: true,
                message: `Request error: no id provided.\nContact Kit.`,
                payload: null,
            })
        }
    } catch (e) {
        res.send({
            error: true,
            message: `Internal server error: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.get('/api/useEvent', async ({ body: { eventId } }, res) => {
    try {
         if (eventId) {
            const dbRes = getEventById(eventId)

             if (dbRes.blocked) {
                 const personBdRes = await getPersonById(dbRes.blocked_by)

                 if (personBdRes) {
                     res.send({
                         error: true,
                         message: `DB error: this event is currently in use by ${personBdRes.display_name}.\nContact Kit.`,
                         payload: null,
                     })
                 }
             } else {
                 res.send({
                     error: false,
                     message: null,
                     payload: dbRes,
                 })
             }
         } else {
             res.send({
                 error: true,
                 message: `Request error: no id provided.\nContact Kit.`,
                 payload: null,
             })
         }
    } catch (e) {
        res.send({
            error: true,
            message: `Internal server error: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
})

app.listen(port, () => console.log(`Listening on port ${port}`))
