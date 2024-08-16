import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleSetToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          token ? <Navigate to="/" replace /> : <Login setToken={handleSetToken} />
        } />
        <Route path="/" element={
          token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;