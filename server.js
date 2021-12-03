const express = require('express');
const bodyParser = require('body-parser');
const { getUserBands, getLogin, getBands, getRoles } = require('./dbApi')

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' })
})

app.post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    )
})

app.post('/api/login', async ({ body }, res) => {
    if (body) {
        const { login, password } = body
        if (login && password) {
            const dbRes = await getLogin(login, password)

            if (dbRes) {
                res.send({
                    error: false,
                    message: null,
                    payload: dbRes
                })
            } else {
                res.send({
                    error: true,
                    message: 'Login and/or password are incorrect!',
                })
            }
        } else {
            res.send({
                error: true,
                message: 'Provide login and password!',
            })
        }
    }
})

app.listen(port, () => console.log(`Listening on port ${port}`))
