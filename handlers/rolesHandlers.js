const { getRoles } = require('../dbApi')

const getAllRolesHandler = async (req, res) => {
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
}

module.exports = {
  getAllRolesHandler
}
