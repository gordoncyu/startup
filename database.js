const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const secrets = require('./.secrets.json').mongodb;
const url = `mongodb+srv://${secrets.userName}:${encodeURIComponent(secrets.password)}@${secrets.hostname}`;

const client = new MongoClient(url);
const db = client.db('1337code');

const userCollection = db.collection("users")
const problemCollection = db.collection("problems")
const scoreCollection = db.collection("scores")

(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});

async function insertProblems(problemsPath = "./problems.js") {
    await insertIfNotExists(problemCollection, require(problemsPath))
    console.log(await problemsCol.find().toArray())
}

async function insertIfNotExists(collection, documents) {
    const insertableDocs = [];

    for (let doc of documents) {
        const exists = await collection.countDocuments({ _id: doc._id });
        if (exists === 0) {
            insertableDocs.push(doc);
        }
    }

    if (insertableDocs.length > 0) {
        return collection.insertMany(insertableDocs, { ordered: false });
    } else {
        return Promise.resolve('No new documents to insert');
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
  getUser,
  getUserByAuth,
  createUser,
  getProblem,
  getProblems,
  addScore,
  getHighScores,
}
