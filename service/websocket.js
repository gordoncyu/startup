const WebSocket = require('ws');

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

