import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/ayu-dark.css';
import 'codemirror/mode/python/python';

function Problem() {
    const { problemName } = useParams();
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState("# Inputs come through stdin; output through stdout\nimport sys");
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const resultRef = useRef(null);
    const qrcodeFetchRef = useRef(null);
    const websocketRef = useRef(null);

    useEffect(() => {
        async function getProblem() {
            const problemReq = await fetch(`/api/problems/${encodeURIComponent(problemName)}`);
            if (problemReq.ok) {
                const reqProb = await problemReq.json()
                setProblem(reqProb);
                setLikes(reqProb.likes)
                setDislikes(reqProb.dislikes)
                console.log(reqProb);
            } else {
                // TODO: problems bad res
            }
        }
        getProblem();

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}/ws/ratings`;
        websocketRef.current = new WebSocket(wsUrl);

        websocketRef.current.onopen = () => {
            console.log("WebSocket is open now.");
            websocketRef.current.send(JSON.stringify({ problemName }));
        };

        websocketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.likes !== undefined) {
                setLikes(data.likes);
            }
            if (data.dislikes !== undefined) {
                setDislikes(data.dislikes);
            }
        };

        websocketRef.current.onclose = () => console.log("WebSocket is closed now.");

        return () => {
            websocketRef.current.close();
        };
    }, []);

    const handleRating = (type) => {
        if (websocketRef.current) {
            websocketRef.current.send(JSON.stringify({ problemName, type }));
        }
    };

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

    async function testSolution(problemName, input, expectedOutput) {
        window.pyodide.setStdin(new StdinHandler(input));

        let outputHandler = new OutputHandler();
        window.pyodide.setStdout(outputHandler);

        const startTime = performance.now();
        window.pyodide.runPython(code);
        const timeTaken = performance.now() - startTime;

        if (outputHandler.getOutput().trim() !== expectedOutput.trim()) {
            resultRef.current.classList.remove("text-green-600");
            resultRef.current.classList.add("text-red-600");
            resultRef.current.textContent = `Error: Incorrect output (time:${timeTaken}ms)`;
            return;
        }

        let loc = 0;
        for (let line of code.split("\n")) {
            if (line.trim() === "") {
                continue;
            }
            if (line.trim().charAt(0) === '#') {
                continue;
            }
            loc++;
        }

        const username = localStorage.getItem("username");

        let successMessage = `Success! Took ${timeTaken} milliseconds with ${loc} lines of code.`;

        resultRef.current.classList.remove("text-red-600");
        resultRef.current.classList.add("text-green-600");

        if (username == null) {
            successMessage += " You're not logged in, so your score and solution won't be saved.";
            resultRef.current.textContent = successMessage;
            return;
        }

        const response = await fetch(`/api/problems/${encodeURIComponent(problemName)}/solution`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                solution: code,
                loc: loc,
                time: timeTaken,
            })
        });
        const body = await response.json();
        const solutionId = body.solutionId;

        successMessage += " Your score and solution have been saved to the server. You can now share it with a qr code.";
        resultRef.current.textContent = successMessage;

        if (qrcodeFetchRef.current.firstElementChild) {
            qrcodeFetchRef.current.removeChild(qrcodeFetchRef.current.firstElementChild);
        }
        console.log(solutionId)
        qrcodeFetchRef.current.insertAdjacentHTML('afterbegin', `
             <img src="https://qrtag.net/api/qr.svg?url=startup.1337code.click/solutions/${ encodeURIComponent(solutionId) }" alt="qrtag">
        `);
    }
    return (
        <main className="border-b border-gray-700">
            <div className="flex flex-col p-8">
                {problem && (
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">
                                    {problem.difficulty}
                                </span>
                                <button onClick={() => handleRating('like')}>
                                    <img src="/images/thumbs-up.png" width="16pt" alt="Thumbs Up" />
                                </button>
                                <span>{likes}</span>
                                <button onClick={() => handleRating('dislike')}>
                                    <img src="/images/thumbs-down.png" width="16pt" alt="Thumbs Down" />
                                </button>
                                <span>{dislikes}</span>
                            </div>
                        </div>

                        <Link to={`/problems/${encodeURIComponent(problem.name)}/leaderboard`} className="button bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                            Leaderboard
                        </Link>

                        <h1 className="text-3xl font-bold">{problem.name}</h1>
                        <div dangerouslySetInnerHTML={{ __html: problem.description }} />
                    </div>
                )}

                <div className="mt-10">
                    <p className="flex items-center">
                        Forgive us for our web code editor is lacking. We recommend you write your code in
                        <a href="https://neovim.io/" className="inline-flex items-center text-blue-500 mx-2">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Neovim-mark.svg/1200px-Neovim-mark.svg.png"
                                alt="NeoVim"
                                className="w-3.5 h-3.5 inline-block align-middle"
                            />
                            eoVim
                        </a>
                        .
                    </p>
                    <pre>
                        <CodeMirror
                            value={code}
                            options={{
                                mode: 'python',
                                theme: 'ayu-dark',
                                lineNumbers: true,
                            }}
                            onBeforeChange={(editor, data, value) => {
                                setCode(value);
                            }}
                        />
                    </pre>
                </div>

                <div>
                    <button onClick={() => testSolution(problemName, problem.input, problem.output)}>Submit</button>
                </div>

                <div ref={resultRef} id="testResult"></div>
            </div>

            <div ref={qrcodeFetchRef} id="qrcodeFetchDiv" className="m-2"></div>

        </main>
    );
}

export default Problem;
