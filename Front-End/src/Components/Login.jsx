import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for routing
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student' // Default role
  });
  const [error, setError] = useState(null);

  const { username, password, role } = formData;
  const navigate = useNavigate();  // Initialize the navigate function

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    const requestData = {
      Username: username,
      Password: password,
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      console.log(data); // Handle successful login data
      onLogin(username, role);

      // Navigate to the student dashboard upon successful login
      if (role === 'student') {
        navigate('/student');
      } else if (role === 'admin') {
        navigate('/admin');
      }
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1>Student Calendar</h1>
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Username/ID</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select 
              name="role" 
              value={role} 
              onChange={onChange}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        {error && <p>{error}</p>} {/* Display error message if login fails */}
      </div>
    </div>
  );
};

export default Login;
