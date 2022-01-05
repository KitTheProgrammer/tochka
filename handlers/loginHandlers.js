const { getLogin, getUserPassword, updateUserPassword } = require('../dbApi')

const loginHandler = async ({ body }, res) => {
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
        console.log(e)
        res.send({
            error: true,
            message: `Internal server error at /api/login: ${e}.\nContact Kit.`,
            payload: null,
        })
    }
}

const changePassword = async ({ body }, res) => {
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
}

module.exports = {
    loginHandler,
    changePassword,
}
