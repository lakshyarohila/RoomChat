import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Join.css';

const Join = () => {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username && room) {
            navigate(`/chat?username=${username}&room=${room}`);
        }
    };

    return (
        <div className="join-container">
            <header className="join-header">
                <h1>Chat App</h1>
            </header>
            <main className="join-main">
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Enter username..."
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="room">Room</label>
                        <select
                            name="room"
                            id="room"
                            onChange={(e) => setRoom(e.target.value)}
                            required
                        >
                            <option value="">Select a room...</option>
                            <option value="General">General</option>
                            <option value="Technology">Technology</option>
                            <option value="Music">Music</option>
                            <option value="Gaming">Gaming</option>
                        </select>
                    </div>
                    <button type="submit" className="btn">Join Chat</button>
                </form>
            </main>
        </div>
    );
};

export default Join;