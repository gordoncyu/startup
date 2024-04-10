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

// Immediately invoke initializeDatabase but do not wait here, let the callers handle this.
initializeDatabase();

function ensureDatabaseInitialization() {
    return dbInitializationPromise;
}
async function insertProblems(problemsPath = "./problems.js", replace = false) {
    const problems = require(problemsPath);
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

function getUser(username) {
    const user = userCollection.findOne({ _id: username })
    return idToName(user)
}

function getUserByAuth(auth) {
    const user = userCollection.findOne({ auth: auth })
    return idToName(user)
}

async function createUser(username, password) {
    const user = await userCollection.insertOne({
        _id: username,
        password: await bcrypt.hash(password, 31),
        auth: uuid.v4(),
    })
    return idToName(user)
}

function getProblem(id) {
    const problem = userCollection.findOne({ _id: id })
    return idToName(problem)
}

async function getProblems(getDescription = false) {
    let problems = await problemCollection.find()
    if (getDescription == false) {
        problems = problems.map(({description, ...rest}) => rest);
    }
    return problems.map(idToName)
}


function addScore(score) {
    scoreCollection.insertOne(score);
}

function getHighScores() {
    return scoreCollection.find({}, {
        sort: { score: -1 },
        limit: 10,
    }).toArray();
}

function idToName(document) {
    if (document === null) {
        return null
    };
    return {_id:username, ...rest} = document
}

module.exports = {
    ensureDatabaseInitialization,
    getUser,
    getUserByAuth,
    createUser,
    getProblem,
    getProblems,
    addScore,
    getHighScores,
    insertProblems,
}
