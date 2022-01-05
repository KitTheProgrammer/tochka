const { getPersonById, getAllUsers } = require('../dbApi')

const getPersonByIdHandler = async ({ body: { personId } }, res) => {
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
}

const getAllUsersHandler = async (req, res) => {
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
}

module.exports = {
  getPersonByIdHandler,
  getAllUsersHandler,
}
