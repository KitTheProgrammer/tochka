const db = require('./database')
const { as } = require('pg-promise')

const getUserBands = async(userId) => {
    return await db.any(
    `SELECT 
        band.id, band.band_name 
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
            calendar.end_at AS "endAt", calendar.summary, calendar.color, calendar.created_by,
            calendar.updated_at, calendar.blocked, calendar.blocked_by
        FROM calendar`)
}

const getPersonById = async (id) => {
    return await db.oneOrNone(
        `SELECT
            person.id, person.display_name
        FROM 
            person
        WHERE
            id = ${id}`)
}

const getEventById = async (id) => {
    return await db.oneOrNone(
        `SELECT
            calendar.id, calendar.blocked, calendar.blocked_by
        FROM 
            calendar
        WHERE
            id = ${id}`)
}

module.exports = { getUserBands, getLogin, getRoles, getBands, getCalendar, getEventById, getPersonById }
