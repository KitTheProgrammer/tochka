const { getAllStuff, getStuffById, updateStuff, createStuff, deleteStuff } = require('../dbApi')

const getAllStuffHandler = async (req, res) => {
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
}

const getStuffByIdHandler = async ({ body }, res) => {
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
}

const updateStuffHandler = async ({ body }, res) => {
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
}

const createStuffHandler = async ({ body }, res) => {
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
}

const deleteStuffHandler = async ({ body }, res) => {
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
}

module.exports = {
  getAllStuffHandler,
  getStuffByIdHandler,
  updateStuffHandler,
  createStuffHandler,
  deleteStuffHandler,

}
