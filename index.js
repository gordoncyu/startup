const express = require('express');
const http = require('http')
const WebSocket = require('ws');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const marked = require('marked');
const dedent = require('dedent')
const markedRenderer = require('./markedRenderer.js')
marked.setOptions({markedRenderer})

const DB = require('./database.js')

app.use(express.static('public'))
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app)
const wsr = new WebSocket.Server({ server, path: "/ws/ratings" });

const socksInProblem = new Map()
const socksProblem = new Map()
wsr.on('connection', (ws) => {
    console.log('A new client connected!');

    ws.on('message', async (message) => {
        console.log('received: %s', message);
        const data = JSON.parse(message);

        if (data.type === undefined) {
            if (!socksInProblem.has(data.problemName)) {
                socksInProblem.set(data.problemName, new Set())
            }
            socksInProblem.get(data.problemName).add(ws)
            socksProblem.set(ws, data.problemName)
            return
        }

        const isLike = data.type == 'like'
        const newCount = await DB.rateProblem(data.problemName, isLike)

        for (wscon of socksInProblem.get(data.problemName)) {
            wscon.send(`
                <span id="${isLike ? 'like' : 'dislike'}Counter">${newCount}</span>
                `)
        }
    });

    ws.on('close', () => {
        console.log('Connection closed');
        try {
            socksInProblem.get(socksProblem.get(ws)).delete(ws)
        } catch (err) {
            console.log(err)
        }
        try {
            socksProblem.delete(ws)
        } catch (err) {
            console.log(err)
        }
    });
})

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});

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
    const javascript = `
window.problemName = "${escapeJavaScriptString(problem.name)}"
window.input = \`${escapeJavaScriptString(problem.input)}\`
window.expectedOutput = \`${escapeJavaScriptString(problem.output)}\`
setTimeout(() => {
    window.main()
}, 100)
    `
    res.render('partials/problem', { problem: problem, javascript:javascript })
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

app.post('/problems/:problemName/solution', async (req, res, next) => {
    const solutionId = DB.addScore(req.params.problemName, req.body.username, req.body.solution, req.body.loc, req.body.time)
    res.json({solutionId: solutionId})
});

app.get('/comp/getqr/:solutionId', (req, res, next) => {
    res.type('text/html')
    res.write(`<img src="https://qrtag.net/api/qr.svg?url=startup.1337code.click/solutions/${ encodeURIComponent(req.params.solutionId) }" alt="qrtag">`)
    res.end()
})

app.get('/solutions/:solutionId', async (req, res, next) => {
    const auth = req.cookies?.auth
    const username = auth == undefined ? null : (await DB.getUserByAuth(auth)).name
    const solution = await DB.getSolution(req.params.solutionId)
    if (solution == null) {
        res.render('spa', { contentPartial: "404", username: username })
        return
    }

    res.render('spa', { contentPartial: "solution", contentParams: {solution: solution}, username: username })
})

app.post('/comp/register', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const auth = await DB.createUser(username, password)
        setAuthCookie(res, auth)
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

function escapeJavaScriptString(str) {
    return str.replace(/\\/g, '\\\\')
              .replace(/"/g, '\\"')
              .replace(/`/g, '\\`');
}
