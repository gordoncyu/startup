import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Problems() {
    const [problems, setProblems] = useState([])

    useEffect(() => {
        async function getProblems() {
            const problemReq = await fetch("/api/problems")
            if (problemReq.ok) {
                setProblems(await problemReq.json())
            } else {
                // TODO: problems bad res
            }
        }
        getProblems()
    }, [])

    return (
        <main className="border-b border-gray-700">
            <div className="flex flex-col p-8">
                <section className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <h2 className="text-2xl font-bold mb-4">Questions</h2>
                        <div className="content-box bg-[#1e1e1e] p-4 rounded-md">
                            <div className="flex justify-between mb-4">
                                <div className="font-bold text-xl">Title</div>
                                <div className="font-bold text-xl">Difficulty</div>
                            </div>
                            {problems.map((problem) => (
                                <div key={problem.name} className="flex justify-between m-4">
                                    <Link to={`/problems/${encodeURIComponent(problem.name)}`} className="text-blue-500">
                                        {problem.name}
                                    </Link>
                                    <div className="inline-block px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">
                                        {problem.difficulty}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Problems;
