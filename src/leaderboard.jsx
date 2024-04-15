import React, { useEffect, useState} from 'react';
import { Link, useParams } from 'react-router-dom';

function Leaderboard() {
    const [scores, setScores] = useState([])
    const { problemName } = useParams()
    useEffect(() => {
        async function getScores() {
            const scoresReq = await fetch(`/api/problems/${encodeURIComponent(problemName)}/leaderboard`)
            if (scoresReq.ok) {
                setScores(await scoresReq.json())
            } else {
                // TODO: problems bad res
            }
        }
        getScores()
    }, [])

    return (
        <main className="border-b border-gray-700">
            <div className="flex flex-col p-8">
                <section className="grid">
                    <div className="col-span-2 mb-4">
                        <Link
                            to={`/problems/${encodeURIComponent(problemName)}`}
                            className="button bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mb-2"
                        >
                            &lt;-- Back
                        </Link>
                        <h1 className="text-2xl font-bold mb-4">{problemName} Leaderboard</h1>
                        <div className="content-box bg-[#1e1e1e] p-4 rounded-md">
                            <div className="flex justify-between mb-4">
                                <div className="font-bold text-xl">Name</div>
                                <div className="font-bold text-xl">Lines of Code</div>
                                <div className="font-bold text-xl">Running Time</div>
                            </div>
                            {scores.map((score) => (
                                <div key={score.time} className="flex justify-between m-4">
                                    <p>{score.username}</p>
                                    <p>{score.loc}</p>
                                    <p>{score.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Leaderboard;
