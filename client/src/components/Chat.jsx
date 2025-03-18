import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import queryString from 'query-string';
import './Chat.css';

const ENDPOINT = window.location.origin;
const newSocket = io(ENDPOINT);
const Chat = () => {
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    // Initial connection and room join
    useEffect(() => {
        const { username, room } = queryString.parse(location.search);
        setUsername(username);
        setRoom(room);

        const newSocket = io(ENDPOINT);
        setSocket(newSocket);

        // Emit join room event
        newSocket.emit('joinRoom', { username, room });

        // Cleanup on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, [location.search]);

    // Handle messages and room users
    useEffect(() => {
        if (!socket) return;

        // Message from server
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Get room users
        socket.on('roomUsers', ({ users }) => {
            setUsers(users);
        });
    }, [socket]);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send message
    const sendMessage = (e) => {
        e.preventDefault();

        if (message && socket) {
            socket.emit('chatMessage', message);
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <header className="chat-header">
                <h1>Chat App</h1>
                <a href="/" className="btn">Leave Room</a>
            </header>
            <main className="chat-main">
                <div className="chat-sidebar">
                    <h3>Room Name:</h3>
                    <h2 id="room-name">{room}</h2>
                    <h3>Users</h3>
                    <ul id="users">
                        {users.map((user, index) => (
                            <li key={index}>{user.username}</li>
                        ))}
                    </ul>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.user === username ? 'my-message' : ''}`}
                        >
                            <p className="meta">
                                {msg.user} <span>{msg.time}</span>
                            </p>
                            <p className="text">{msg.text}</p>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <div className="chat-form-container">
                <form id="chat-form" onSubmit={sendMessage}>
                    <input
                        id="msg"
                        type="text"
                        placeholder="Enter Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        autoComplete="off"
                        required
                    />
                    <button className="btn"><i className="fas fa-paper-plane"></i> Send</button>
                </form>
            </div>
        </div>
    );
};

export default Chat;