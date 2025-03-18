const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

const server = http.createServer(app);
const io = socketIo(server);

// Socket.io logic
// (Copy your existing Socket.io code here)
const users = [];

function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

io.on('connection', socket => {
    console.log('New connection:', socket.id);

    // Join room
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome message
        socket.emit('message', {
            user: 'ChatBot',
            text: `Welcome to ${user.room}!`,
            time: new Date().toLocaleTimeString()
        });

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', {
            user: 'ChatBot',
            text: `${user.username} has joined the chat`,
            time: new Date().toLocaleTimeString()
        });

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chat message
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', {
                user: user.username,
                text: msg,
                time: new Date().toLocaleTimeString()
            });
        }
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', {
                user: 'ChatBot',
                text: `${user.username} has left the chat`,
                time: new Date().toLocaleTimeString()
            });

            // Send updated users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));