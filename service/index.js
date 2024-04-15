const express = require('express');
const http = require('http')
const WebSocket = require('ws');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const marked = require('marked');
const markedRenderer = require('./markedRenderer.js')
marked.setOptions({markedRenderer})

const DB = require('./database.js')

app.use(express.static('public'))
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('trust proxy', true);

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

const server = http.createServer(app)

apiRouter.use((req, res, next) => {
    console.log(req.url)
    next()
})
    
apiRouter.get('/problems', async (req, res, next) => {
    const problems = await DB.getProblems()
    res.json(problems)
});

apiRouter.get('/problems/:problemName', async (req, res, next) => {
    let problem = await DB.getProblem(req.params.problemName)
    if (problem == null) {
        res.status(404)
        return
    }
    problem.description = marked.marked(problem.description)

    res.json(problem)
});

apiRouter.get('/problems/:problemName/leaderboard', async (req, res, next) => {
    let problem = await DB.getProblem(req.params.problemName)
    if (problem == null) {
        res.status(404)
        return
    }
    const scores = await DB.getHighScores(req.params.problemName)
    res.json(scores)
});

apiRouter.post('/problems/:problemName/solution', async (req, res, next) => {
    const solutionId = DB.addScore(req.params.problemName, req.body.username, req.body.solution, req.body.loc, req.body.time)
    res.json({solutionId: solutionId})
    res.end()
});

apiRouter.get('/solutions/:solutionId', async (req, res, next) => {
    const solution = await DB.getSolution(req.params.solutionId)
    if (solution == null) {
        res.status(404)
        return
    }

    res.json(solution)
    res.end()
})

apiRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const auth = await DB.createUser(username, password)
        setAuthCookie(res, auth)
        res.status(200)
    } catch (error) {
        let errorMessage
        if (error.code === 11000) {
            res.statusMessage = "Conflict: Username already taken"
            res.status(409)
            return
        }
        res.status(500)
        throw error
    }
})

apiRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    const user = await DB.getUser(username)
    if (user === null  || !(await bcrypt.compare(password, user.password))) {
        res.status(401)
        res.end()
        return
    }

    setAuthCookie(res, user.auth)
    res.status(200)
    res.end()
})

apiRouter.get('/logout', async (req, res, next) => {
    res.clearCookie("auth")
    res.end()
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

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});

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
            wscon.send(JSON.stringify({[isLike ? "likes" : "dislikes"]: newCount}))
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

