const dedent = require('dedent');

const problems = [
    {
        _id: "Multiples of Three or Five",
        difficulty: "easy",
        description: dedent`
            Calculate the sum of multiples of \`3\` or \`5\` that are less than a given integer \`n\`. For every number provided, find all the natural numbers below it which are multiples of either \`3\` or \`5\` and sum them up. Repeat this process for each input value and return a corresponding list of sums.<br><br>
            Example:<br><br>
            Input:<br>
            \`\`\`
            10
            15
            20
            \`\`\`
            Output:<br>
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
    },
    {
        _id: "Even Fibonnacci",
        difficulty: "easy",
        description: dedent`
        Create a function that sums up all even Fibonacci numbers that do not exceed a given integer n. For each input value, compute the sum of even numbers in the Fibonacci sequence that are less than or equal to n and return these sums as a list.<br><br>
        Each line of input will contain a single integer n, representing the upper limit for the Fibonacci sequence values.<br><br>
        Output the results as a list of sums, each corresponding to the input lines.<br><br>
        Example:<br><br>
        Input:<br>
        \`\`\`
        10
        18
        23
        \`\`\`
        Output:<br>
        \`\`\`
        10
        10
        44
        \`\`\`
        `,
        input: dedent`
        100
        1000
        5000
        10000
        20000
        30000
        50000
        70000
        90000
        100000
        `,
        output: dedent`
        44
        798
        3382
        3382
        14328
        14328
        60696
        60696
        60696
        60696
        `
    },
    {
        _id: "Largest Prime Factor",
        difficulty: "easy",
        description: dedent`
        Create a function that finds the largest prime factor of a given integer n. For each input value, determine the largest prime number that divides n without leaving a remainder and return these as a list.<br><br>
        Each line of input will contain a single integer n, representing the number to find the largest prime factor for.<br><br>
        Output the results as a list of the largest prime factors, each corresponding to the input lines.<br><br>
        Example:<br><br>
        Input:<br>
        \`\`\`
        15
        77
        100
        \`\`\`
        Output:<br>
        \`\`\`
        5
        11
        5
        \`\`\`
        `,
        input: dedent`
        976033
        3914
        761177
        324978
        348803
        499041
        603056
        219620
        236827
        884562
        `,
        output: dedent`
        976033
        103
        761177
        54163
        3833
        101
        37691
        139
        13931
        21061
        `
    },
    {
        _id: "Largest Palindrome Product",
        difficulty: "easy",
        description: dedent`
        Create a function that identifies the largest palindrome made from the product of two n-digit numbers. For each input value, determine the largest palindrome that can be formed by multiplying two numbers, where each multiplier has exactly n digits. Return these palindromes as a list.<br><br>
        Each line of input will contain a single integer n, indicating the number of digits for the multipliers.<br><br>
        Output the results as a list of the largest palindromes, each corresponding to the input lines.<br><br>
        Example:<br><br>
        Input:<br>
        \`\`\`
        2
        3
        \`\`\`
        Output:<br>
        \`\`\`
        9009
        906609
        \`\`\`
        `,
        input: dedent`
        1
        2
        3
        4
        `,
        output: dedent`
        9
        9009
        906609
        99000099
        `
    },
    {
        _id: "Swapping Alphabeticals",
        difficulty: "good luck lmao",
        description: dedent`
        Create a function that calculates the number of swaps needed to reach a specific permutation of a set of letters from their initial alphabetical order. At each step, swap the largest letter with the letter on its left or right that produces a permutation not previously generated. If neither direction offers a new permutation, move to the next largest letter. The process continues until the target permutation is reached.<br><br>
        The input for each line will be a single phrase composed only of alphabetical characters with no spaces. The output should be the number of swaps required to rearrange the letters from alphabetical order to the order specified in the input.<br><br>
        Example:<br><br>
        Input:<br>
        \`\`\`
        CBA
        BELFRY
        \`\`\`
        Output:<br>
        \`\`\`
        3
        59
        \`\`\`
        `,
        input: dedent`
        ABC
        ACB
        BAC
        BCA
        CAB
        CBA
        DACB
        DABC
        CDAB
        BCDA
        BELFRY
        NOWPICKBELFRYMATHS
        `,
        output: dedent`
        0
        1
        1
        2
        2
        3
        4
        3
        4
        3
        59
        3832914911887589
        `
    },
    {
        _id: "Removing Cubes",
        difficulty: "good luck lmao",
        description: dedent`
        Create a function that calculates how many steps it takes to reduce a positive integer n to zero. At each step, subtract from n the largest perfect cube not exceeding n. The procedure continues until n becomes zero.<br><br>
        Define D(n) as the number of steps required for this procedure for a specific integer n. You will also calculate S(N), which is defined as the sum of D(n) for all positive integers strictly less than N.<br><br>
        The input for this problem is a single integer N. The output should be the value of S(N), the sum of the number of steps for all integers less than N.<br><br>
        Example:<br><br>
        Input:<br>
        \`\`\`
        100
        \`\`\`
        Output:<br>
        \`\`\`
        512
        \`\`\`
        `,
        input: dedent`
        10
        50
        100
        150
        200
        250
        300
        350
        400
        100000000000000000
        `,
        output: dedent`
        27
        372
        512
        806
        1189
        1666
        2199
        2828
        3510
        1105985795684653500
        `
    },
]

module.exports = problems

async function insertAndReplace() {
    const DB = require("./database.js")
    await DB.ensureDatabaseInitialization()
    await DB.insertProblems("./problems.js", true)
    console.log("Problems inserted")
}

insertAndReplace()
