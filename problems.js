const dedent = require('dedent');

const problems = [
    {
        _id: "Multiples of Three or Five",
        difficulty: "easy",
        description: dedent`
            Calculate the sum of multiples of $3$ or $5$ that are less than a given integer $n$. For every number provided, find all the natural numbers below it which are multiples of either $3$ or $5$ and sum them up. Repeat this process for each input value and return a corresponding list of sums.

            Example:

            Input:

            \`\`\`
            10
            15
            20
            \`\`\`

            Output:

            \`\`\`
            23
            45
            78
            \`\`\`
        `,
        input: dedent`
        5623
        2262
        6962
        1570
        7967
        3440
        8504
        2831
        6337
        9385
        `,
        output: dedent`
        7380000
        1193658
        11306520
        574883
        14806935
        2758308
        16873920
        1871103
        9371579
        20550023
        `
    }
]

module.exports = problems

async function insertAndReplace() {
    const DB = require("./database.js")
    await DB.ensureDatabaseInitialization()
    await DB.insertProblems("./problems.js", true)
    console.log("Problems inserted")
}

insertAndReplace()
