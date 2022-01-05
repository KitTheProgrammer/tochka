const express = require('express')
const bodyParser = require('body-parser')
const { loginHandler, changePassword } = require('./handlers/loginHandlers')
const { getBandsHandler, userBandsHandler } = require('./handlers/bandHandlers')
const { getCalendarHandler, useEventHandler, setEventStatusHandler, updateEventHandler, deleteEventHandler,
    createEventHandler
} = require('./handlers/calendarHandlers')
const { getPersonByIdHandler, getAllUsersHandler } = require('./handlers/userHandlers')
const { getAllStuffHandler, getStuffByIdHandler, updateStuffHandler, createStuffHandler } = require('./handlers/stuffHandlers')
const { getAllRolesHandler } = require('./handlers/rolesHandlers')

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/roles', getAllRolesHandler)

app.get('/api/bands', getBandsHandler)

app.post('/api/login', loginHandler)

app.post('/api/userBands', userBandsHandler)

app.get('/api/calendar', getCalendarHandler)

app.post('/api/getPerson', getPersonByIdHandler)

app.post('/api/useEvent', useEventHandler)

app.post('/api/setEventStatus', setEventStatusHandler)

app.post('/api/updateEvent', updateEventHandler)

app.post('/api/deleteEvent', deleteEventHandler)

app.post('/api/createEvent', createEventHandler)

app.post('/api/changePassword', changePassword)

app.get('/api/getAllStuff', getAllStuffHandler)

app.post('/api/getStuffById', getStuffByIdHandler)

app.post('/api/updateStuff', updateStuffHandler)

app.post('/api/createStuff', createStuffHandler)

app.post('/api/deleteStuff', deleteEventHandler)

app.get('/api/getAllUsers', getAllUsersHandler)

app.listen(port, () => console.log(`Listening on port ${port}`))
