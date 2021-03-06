const db = require('./database')

const getUserBands = async(userId) => {
    return await db.any(
    `SELECT 
        band.id, band.band_name, band.band_color
    FROM 
        person 
        LEFT JOIN user_bands ON person.id = user_bands.user_id 
        LEFT JOIN band ON user_bands.band_id = band.id 
    WHERE 
        person.id = ${userId};`
    )
}

const getLogin = async (login, password) => {
  return await db.oneOrNone(
      `SELECT
          person.id, person.display_name, person.role_id
      FROM
          person
      WHERE
          person.login = '${login}' and person.password = '${password}'`
  )
}

const getRoles = async () => {
    return await db.many('SELECT * FROM role')
}

const getBands = async () => {
    return await db.many('SELECT * FROM band')
}

const getCalendar = async () => {
    return await db.manyOrNone(
        `SELECT 
            calendar.id, calendar.date, calendar.start_at AS "startAt",
            calendar.end_at AS "endAt", calendar.summary, calendar.color, person_1.display_name AS "created_by",
            calendar.updated_at, calendar.blocked, person_2.display_name AS "blocked_by", calendar.individual,
            calendar.band_id
        FROM 
            calendar
            INNER JOIN person AS person_1 ON calendar.created_by = person_1.id
            INNER JOIN person AS person_2 ON calendar.blocked_by = person_2.id`
    )
}

const getPersonById = async (id) => {
    return await db.oneOrNone(
        `SELECT
            person.id, person.display_name, person.tg_tag
        FROM 
            person
        WHERE
            id = ${id}`
    )
}

const getEventById = async (id) => {
    return await db.oneOrNone(
        `SELECT
            calendar.id, calendar.blocked, person_2.display_name AS "blocked_by",
            person_1.display_name AS "created_by", updated_at, calendar.blocked_by AS "blocked_by_id",
            calendar.band_id, calendar.individual, calendar.created_by AS "created_by_id",
            calendar.summary, calendar.start_at, calendar.end_at, calendar.date
        FROM 
            calendar
            INNER JOIN person AS person_1 ON calendar.created_by = person_1.id
            INNER JOIN person AS person_2 ON calendar.blocked_by = person_2.id
        WHERE
            calendar.id = ${id}`
    )
}

const getEventsByDate = async (date) => {
    return await db.manyOrNone(
        `SELECT
            calendar.id, calendar.summary, calendar.start_at, calendar.end_at
        FROM 
            calendar
        WHERE
            calendar.date = '${date}'`
    )
}

const setEventStatus = async (eventId, status, userId, updatedAt) => {
    return await db.query(
        `UPDATE
            calendar
        SET
            blocked = $1, blocked_by = $2, updated_at = $4
        WHERE
            id = $3`,
        [status, userId, eventId, updatedAt]
    )
}

const updateEvent = async (eventId, startAt, endAt, summary, color, updatedAt, blockedBy, individual, band_id) => {
    return await db.query(
        `UPDATE
            calendar
        SET
            start_at = $1, end_at = $2, summary = $3, color = $4, updated_at = $5, blocked = false,
            blocked_by = $6, individual = $7, band_id = $8
        WHERE
            id = $9`,
        [startAt, endAt, summary, color, updatedAt, blockedBy, individual, band_id, eventId]
    )
}

const deleteEvent = async (eventId) => {
    return await db.query(
        `DELETE FROM
            calendar
        WHERE
            id = $1`, [eventId])
}

const createEvent = async (date, startAt, endAt, summary, color, created_by, updated_at, individual, band_id) => {
    return await db.query(
        `INSERT INTO 
            calendar (date, start_at, end_at, summary, color, created_by, updated_at, blocked, blocked_by, individual, band_id)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, false, $6, $8, $9)`,
        [date, startAt, endAt, summary, color, created_by, updated_at, individual, band_id]
    )
}

const getUserPassword = async (userId) => {
    return await db.oneOrNone(`SELECT password FROM person WHERE id = ${userId}`)
}

const updateUserPassword = async (userId, password) => {
    return await db.query(`UPDATE person SET password = $1 WHERE id = ${userId}`, [password])
}

const getAllStuff = async () => {
    return await db.many(
        `SELECT
            stuff.id, stuff.name, person_1.display_name as "created_by", stuff.used_by, 
            stuff.acceptable_users, stuff.available, stuff.created_by as "created_by_id"
        FROM
            stuff
            INNER JOIN person AS person_1 ON stuff.created_by = person_1.id`
    )
}

const getStuffById = async (stuffId) => {
    return await db.oneOrNone(
        `SELECT
            stuff.id, stuff.name, stuff.created_by, stuff.used_by, stuff.acceptable_users, stuff.available
        FROM
            stuff
        WHERE
            stuff.id = ${stuffId}`
    )
}

const updateStuff = async (stuffId, name, used_by, acceptable_users, available) => {
    return await db.query(
        `UPDATE
            stuff
        SET
            name = $1, used_by = $2, acceptable_users = $3, available = $4
        WHERE
            id = $5`, [name, used_by, acceptable_users, available, stuffId]
    )
}

const createStuff = async (name, created_by, used_by, acceptable_users, available) => {
    return await db.query(
        `INSERT INTO
            stuff (name, created_by, used_by, acceptable_users, available)
        VALUES
            ($1, $2, $3, $4, $5)`, [name, created_by, used_by, acceptable_users, available]
    )
}

const deleteStuff = async (stuffId) => {
    return await db.query(
        `DELETE FROM
            stuff
        WHERE
            id = ${stuffId}`
    )
}

const getAllUsers = async () => {
    return await db.many(
        `SELECT
            person.id, person.login, person.display_name
        FROM
            person`
    )
}

const getBandById = async (bandId) => {
    return await db.oneOrNone(
        `SELECT
            band.band_name
        FROM
            band
        WHERE
            band.id = $1;`,
        [bandId]
    )
}

const getBandUsers = async (bandId) => {
    return await db.manyOrNone(
        `SELECT 
        person.tg_tag
    FROM 
        band 
        LEFT JOIN user_bands ON band.id = user_bands.band_id 
        LEFT JOIN person ON user_bands.user_id = person.id 
    WHERE 
        band.id = $1;`,
        [bandId]
    )
}

module.exports = {
    getUserBands,
    getLogin,
    getRoles,
    getBands,
    getCalendar,
    getEventById,
    getPersonById,
    setEventStatus,
    updateEvent,
    deleteEvent,
    createEvent,
    getEventsByDate,
    getUserPassword,
    updateUserPassword,
    getAllStuff,
    getStuffById,
    updateStuff,
    createStuff,
    deleteStuff,
    getAllUsers,
    getBandById,
    getBandUsers,
}
