import React, { useState } from 'react';

function Login({ onAuthChange }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            onAuthChange(username);
        } else {
            setError('Invalid credentials');
        }
    };

    const handleRegister = async () => {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            onAuthChange(username);
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <form className="login-form" onSubmit={handleLogin}>
            <input
                type="text"
                name="username"
                placeholder="username"
                required
                className="rounded bg-gray-950 m-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                name="password"
                placeholder="password"
                required
                className="rounded bg-gray-950 m-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input type="submit" value="Log in" className="mx-2"/>
            <input type="button" value="Register" onClick={handleRegister} />

            {error && <p className="text-red">{error}</p>}
        </form>
    );
}

export default Login;
