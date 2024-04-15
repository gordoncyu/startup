import React from 'react';

function UserDisplay({ username, onAuthChange }) {
    const handleLogout = async () => {
        const response = await fetch('/api/logout', { method: 'GET' });
        if (response.ok) {
            console.log("ok")
            onAuthChange(null);
        }
    };

    return (
        <div className="flex space-x-4">
            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                {username}&nbsp;&nbsp;
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Neovim-mark.svg/1200px-Neovim-mark.svg.png"
                    alt="NeoVim"
                    className="w-5 h-5 inline-block align-middle"
                />
            </p>
            <button onClick={handleLogout} className="rounded bg-gray-950 m-2">
                logout
            </button>
        </div>
    );
}

export default UserDisplay;
