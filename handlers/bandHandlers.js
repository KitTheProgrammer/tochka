const { getBands, getUserBands } = require('../dbApi')

const getBandsHandler = async (req, res) => {
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
}

const userBandsHandler = async ({ body }, res) => {
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
}

module.exports = {
  getBandsHandler,
  userBandsHandler,
}