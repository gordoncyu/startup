import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './app.css';
import Header from './header';
import Footer from './footer';
import Problems from './problems';
import Problem from './problem';
import Solution from './solution';
import Leaderboard from './leaderboard';

function App() {
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [currentProblem, setCurrentProblem] = useState(null);

    useEffect(() => {
        console.log(username)
        console.log(typeof username)
        if (username == null) {
            localStorage.removeItem("username")
        } else {
            localStorage.setItem('username', username);
        }
    }, [username]);

    const handleAuthChange = (newUsername) => {
        setUsername(newUsername);
    };

    const handleProblemChange = (problem) => {
        setCurrentProblem(problem);
    };

    return (
        <Router>
            <div className="bg-black text-white font-sans min-h-screen">
                <div className="container mx-auto px-4">
                    <Header username={username} onAuthChange={handleAuthChange} />

                    <Routes>
                            <Route exact path="/" element={<Problems />} />
                        <Route
                            path="/problems/:problemName"
                            element={<Problem />}
                        />
                        <Route
                            path="/problems/:problemName/leaderboard"
                            element={<Leaderboard />}
                        />
                        <Route path="/solutions/:solutionId" element={<Solution />} />
                    </Routes>

                    <Footer />
                </div>
            </div>
        </Router>
    );
}

export default App;
