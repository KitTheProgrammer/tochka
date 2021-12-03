const db = require('./database')

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

module.exports = { getUserBands, getLogin, getRoles, getBands }
