const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const marked = require('marked');
const markedRenderer = require('./markedRenderer.js')
marked.setOptions({markedRenderer})

const DB = require('./database.js')

app.listen(4000);
app.use(express.static('public'))
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

function requireHtmx(req, res, next) {
    if (req.get('HX-Request') !== 'true') {
        return res.status(403).send('HTMX request required.');
    }
    next();
}

app.use('/comp', requireHtmx);
app.use((req, res, next) => {
    console.log(req.url)
    next()
})
    
app.get('/', async (req, res, next) => {
    const auth = req.cookies?.auth
    const username = auth == undefined ? null : (await DB.getUserByAuth(auth)).name
    console.log(username)
    const problems = await DB.getProblems()
    res.render('spa', { contentPartial: "problems", contentParams: {problems: problems}, username: username })
});

app.get('/comp/problems', async (req, res, next) => {
    const problems = await DB.getProblems()
    res.render("partials/problems", {problems: problems})
});

app.get('/problems/:problemName', async (req, res, next) => {
    const auth = req.cookies?.auth
    const username = auth == undefined ? null : await DB.getUserByAuth(auth).username
    let problem = await DB.getProblem(req.params.problemName)
    if (problem == null) {
        res.render('spa', { contentPartial: "404", username: username })
        return
    }
    problem.description = marked.marked(problem.description)
    res.render('spa', { contentPartial: "problem", contentParams: {problem: problem}, username: username })
});

app.get('/comp/problems/:problemName', async (req, res, next) => {
    let problem = await DB.getProblem(req.params.problemName)
    if (problem == null) {
        res.render('404')
        return
    }
    problem.description = marked.marked(problem.description)
    res.render('partials/problem', { problem: problem })
});

app.get('/problems/:problemName/leaderboard', async (req, res, next) => {
    const auth = req.cookies?.auth
    const username = auth == undefined ? null : await DB.getUserByAuth(auth).username
    let problem = await DB.getProblem(req.params.problemName)
    if (problem == null) {
        res.render('spa', { contentPartial: "404", username: username })
        return
    }
    const scores = await DB.getHighScores(req.params.problemName)
    res.render('spa', {
        contentPartial: "leaderboard",
        contentParams: {problemName: req.params.problemName, scores: scores},
        username: username 
    })
});

app.get('/comp/problems/:problemName/leaderboard', async (req, res, next) => {
    let problem = await DB.getProblem(req.params.problemName)
    if (problem == null) {
        res.render('404')
        return
    }
    const scores = await DB.getHighScores(req.params.problemName)
    res.render('partials/leaderboard', {problemName: req.params.problemName, scores: scores})
});

app.post('/comp/register', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        console.log("creating user")
        const auth = await DB.createUser(username, password)
        console.log("created user")
        console.log("setting cookie")
        console.log(auth)
        setAuthCookie(res, auth)
        console.log("rendering")
        res.render('partials/userDisplay', { username: username })
    } catch (error) {
        let errorMessage
        if (error.code === 11000) {
            errorMessage = "Username is already taken!"
            res.render('partials/login', { error: errorMessage })
            return
        }
        errorMessage = "Unknown error occurred"
        res.render('partials/login', { error: errorMessage })
        throw error
    }
})

app.post('/comp/login', async (req, res, next) => {
    const { username, password } = req.body;
    const user = await DB.getUser(username)
    if (user === null  || !(await bcrypt.compare(password, user.password))) {
        res.render('partials/login', { error: "Username or password incorrect."})
        return
    }

    setAuthCookie(res, user.auth)
    res.render('partials/userDisplay', { username: username })
})

app.get('/comp/logout', async (req, res, next) => {
    res.clearCookie("auth")
    res.render('partials/login')
})

function setAuthCookie(res, auth) {
    res.cookie('auth', auth, {
        secure: true,
        httpOnly: false,
        sameSite: 'strict',
    });
}
