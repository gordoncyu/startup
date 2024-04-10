const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const dedent = require('dedent')

const DB = require('./database.js')

app.listen(8080);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
    
app.get('/index.html', async (req, res, next) => {
    const auth = req.cookies?.auth
    const username = auth == undefined ? null : await DB.getUserByAuth(auth).username
    res.render('spa', { contentPartial: "problems", username: username })
});

const REQUIRES_HTMX_STRING = 'Bad Request: This endpoint requires an HTMX request.'
app.post('/register', async (req, res, next) => {
    if (req.get('HX-Request') !== 'true') {
        return res.status(400).send(REQUIRES_HTMX_STRING);
    }

    const { username, password } = req.body;
    try {
        const user = DB.createUser(username, password)
        setAuthCookie(user.auth)
        res.render('partials/userDisplay', { username: username })
    } catch (error) {
        let errorMessage
        if (error.code === 11000) {
            errorMessage = "Username is already taken!"
        } else {
            errorMessage = "Unknown error occurred"
        }
        res.render('partials/login', { error: errorMessage })
    }
})

app.post('/login', async (req, res, next) => {
    if (req.get('HX-Request') !== 'true') {
        return res.status(400).send(REQUIRES_HTMX_STRING);
    }

    const { username, password } = req.body;
    const user = DB.getUser(username)
    if (user === null  || user.password !== bcrypt.hash(password, 31)) {
        res.render('partials/login', { error: "Username or password incorrect."})
        return
    }

    setAuthCookie(user.auth)
    res.render('partials/userDisplay', { username: username })
})

function setAuthCookie(res, auth) {
  res.cookie('auth', auth, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

