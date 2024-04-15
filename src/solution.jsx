import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

function Solution() {
    const { solutionId } = useParams()

    const [ solution, setSolution ] = useState(null)
    useEffect(() => {
        async function getSolution() {
            const solutionRes = await fetch(`/api/solutions/${encodeURIComponent(solutionId)}`)
            if (solutionRes.ok) {
                setSolution(await solutionRes.json())
            } else {
                // TODO no solution with id found
            }
        }
        getSolution()
    }, []);

    return (
        <main className="border-b border-gray-700">
            {solution && (
                <div>
                    <h1 className="text-2xl font-bold mb-4">
                        {solution.username}'s Solution for {solution.problemName}
                    </h1>
                    <pre>
                        <code className="python-html rounded-md">{solution.solution}</code>
                    </pre>
                    <div className="content-box bg-[#1e1e1e] p-4 rounded-md">
                        <div className="flex justify-between mb-4">
                            <div className="font-bold text-xl">time</div>
                            <div className="font-bold text-xl">lines of code</div>
                        </div>
                        <div className="flex justify-between m-4">
                            <p>{solution.time}</p>
                            <p>{solution.loc}</p>
                        </div>
                    </div>
                </div>)}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/base16/ros-pine.min.css"
                />
                <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python.min.js"></script>
            </main>
    );
}

export default Solution;
