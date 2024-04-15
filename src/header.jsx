import React from 'react';
import { Link } from 'react-router-dom';
import UserDisplay from './userDisplay';
import Login from './login';

function Header({ username, onAuthChange }) {
    return (
        <header className="flex justify-between items-center py-6 border-b border-gray-700">
            <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="text-3xl font-bold">
                    <Link to="/">1337code</Link>
                </h1>
                <img src="/images/1337codelogo.png" alt="1337code" style={{ width: '60px', verticalAlign: 'middle' }} />
            </span>

            {username !== null ? (
                <UserDisplay username={username} onAuthChange={onAuthChange} />
            ) : (
                <Login onAuthChange={onAuthChange} />
            )}
        </header>
    );
}

export default Header;
