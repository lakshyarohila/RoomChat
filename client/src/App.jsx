import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Join from './components/Join';
import Chat from './components/Chat';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Join />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </Router>
    );
}

export default App;