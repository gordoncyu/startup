const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const secrets = require('./.secrets.json').mongodb;
const url = `mongodb+srv://${secrets.userName}:${encodeURIComponent(secrets.password)}@${secrets.hostname}`;

let db, userCollection, problemCollection, scoreCollection;

let dbInitializationPromiseResolve;
let dbInitializationPromise = new Promise(resolve => {
    dbInitializationPromiseResolve = resolve;
});

async function initializeDatabase() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        console.log('Connected to database.');

        db = client.db('1337code');
        userCollection = db.collection("users");
        problemCollection = db.collection("problems");
        scoreCollection = db.collection("scores");

        await db.command({ ping: 1 });

        dbInitializationPromiseResolve();
    } catch (ex) {
        console.error(`Unable to connect to database with ${url} because ${ex.message}`);
        process.exit(1);
    }
}

initializeDatabase();

function ensureDatabaseInitialization() {
    return dbInitializationPromise;
}

async function insertProblems(problemsPath = "./problems.js", replace = false) {
    let problems = require(problemsPath);
    problems = problems.map((problem) => {return {likes: 0, dislikes: 0, ...problem}})
    await insertIfNotExists(problemCollection, problems, replace);
    console.log(await problemCollection.find().toArray());
}

async function insertIfNotExists(collection, documents, replace = false) {
    const operations = [];

    for (let doc of documents) {
        if (replace) {
            operations.push({
                updateOne: {
                    filter: { _id: doc._id },
                    update: { $set: doc },
                    upsert: true
                }
            });
        } else {
            const exists = await collection.countDocuments({ _id: doc._id });
            if (exists === 0) {
                operations.push({
                    insertOne: {
                        document: doc
                    }
                });
            }
        }
    }

    if (operations.length > 0) {
        return collection.bulkWrite(operations, { ordered: false });
    } else {
        return Promise.resolve('No operations to perform');
    }
}

async function rateProblem(problemName, like) {
    const likeVal = like ? "likes" : "dislikes"
    const newProblem = await problemCollection.findOneAndUpdate({ _id: problemName }, {$inc: { [likeVal] : 1 }}, {returnDocument: 'after'})
    return newProblem[likeVal]
}

async function getUser(username) {
    const user = await userCollection.findOne({ _id: username })
    return idToName(user)
}

async function getUserByAuth(auth) {
    const user = await userCollection.findOne({ auth: auth })
    return idToName(user)
}

async function createUser(username, password) {
    const auth = uuid.v4()
    userCollection.insertOne({
        _id: username,
        password: await bcrypt.hash(password, 12),
        auth: auth,
    })
    return auth
}

async function getProblem(id) {
    const problem = await problemCollection.findOne({ _id: id })
    return idToName(problem)
}

async function getProblems(getDescription = false) {
    let problems = await problemCollection.find().toArray()
    if (getDescription == false) {
        problems = problems.map(({description, ...rest}) => rest);
    }
    return problems.map(idToName)
}


function addScore(problemName, username, solution, loc, time) {
    const solutionId = uuid.v4()
    score = {
        _id: solutionId,
        problemName: problemName,
        username: username,
        solution: solution,
        loc: loc,
        time: time,
    }
    scoreCollection.insertOne(score);
    return solutionId
}

function getSolution(solutionId) {
    return scoreCollection.findOne({ _id: solutionId })
}

async function getHighScores(problemName) {
    return (await scoreCollection.find({ "problemName": problemName }, {
        sort: { 'time': -1 },
        limit: 100
    }).toArray()).map((score) => {
        const { solution, ...rest } = score;
        return rest
    });
}

function idToName(document) {
    if (document === null) {
        return null
    };
    const { _id: name, ...rest } = document;
    return { name, ...rest };
}

module.exports = {
    ensureDatabaseInitialization,
    rateProblem,
    getUser,
    getUserByAuth,
    createUser,
    getProblem,
    getProblems,
    addScore,
    getSolution,
    getHighScores,
    insertProblems,
}
