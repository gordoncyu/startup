let pyodide
const textarea = document.getElementById('editor')
let editor

async function main() {
    pyodide = await loadPyodide();

    editor = CodeMirror.fromTextArea(textarea, {
        mode: 'text/x-python',
        lineNumbers: true,
        theme: 'ayu-dark'
    });
};

main();

class OutputHandler {
    constructor() {
        this.output = "";
    }
    write(buffer) {
        const string = new TextDecoder("utf-8").decode(buffer);
        this.output += string;
        return buffer.length;
    }
    getOutput() {
        return this.output;
    }
    clearOutput() {
        this.output = "";
    }
}

class StdinHandler {
    constructor(result, options) {
        this.results = result.split("\n");
        this.idx = 0;
        Object.assign(this, options);
    }
    stdin() {
        return this.results[this.idx++];
    }
}

const resultEl = document.querySelector("#testResult")
const qrcodeFetchEl = document.querySelector("#qrcodeFetch")
let outputHandler

async function testSolution() {
    const solution = editor.getValue()
    pyodide.setStdin(new StdinHandler(input))

    outputHandler = new OutputHandler()
    pyodide.setStdout(outputHandler)

    const startTime = performance.now()
    pyodide.runPython(solution)
    const timeTaken = performance.now() - startTime

    if (outputHandler.getOutput().trim() !== expectedOutput.trim()) {
        resultEl.classList.remove("text-green-600")
        resultEl.classList.add("text-red-600")
        resultEl.textContent = `Error: Incorrect output (time:${timeTaken}ms)`
        return
    }

    let loc = 0
    for (line of solution.split("\n")) {
        if (line.trim() == "") {
            continue
        }
        if (line.trim().charAt(0) === '#') {
            continue
        }
        loc++
    }

    const username = localStorage.getItem("username")

    let successMessage = `Success! Took ${timeTaken} milliseconds with ${loc} lines of code.`

    resultEl.classList.remove("text-red-600")
    resultEl.classList.add("text-green-600")

    if (username == null) {
        successMessage += " You're not logged in, so your score and solution won't be saved."
        resultEl.textContent = successMessage
        return
    }

    const response = await fetch(`/problems/${encodeURIComponent(problemName)}/solution`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            solution: solution,
            loc: loc,
            time: timeTaken,
        })
    })
    const body = await response.json()
    const solutionId = body.solutionId

    successMessage += " Your score and solution have been saved to the server. You can now share it with a qr code."
    resultEl.textContent = successMessage

    qrcodeFetchEl.setAttribute("hx-get", "/comp/getqr/" + encodeURIComponent(solutionId))
    qrcodeFetchEl.classList.remove("hidden")
}
