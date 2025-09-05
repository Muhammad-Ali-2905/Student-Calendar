import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import AdminDashboard from './Components/AdminDashboard';
import StudentDashboard from './Components/StudentDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const login = (username, role) => {
    if (username === 'admin' && role === 'admin') {
      setUser({ username, role });
    } else {
      setUser({ username, role: 'student' });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            !user ? <Login onLogin={login} /> : 
              (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/student" />)
          } />
          <Route path="/admin/*" element={
            user && user.role === 'admin' ? <AdminDashboard user={user} onLogout={logout} /> : <Navigate to="/login" />
          } />
          <Route path="/student/*" element={
            user && user.role === 'student' ? <StudentDashboard user={user} onLogout={logout} /> : <Navigate to="/login" />
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
