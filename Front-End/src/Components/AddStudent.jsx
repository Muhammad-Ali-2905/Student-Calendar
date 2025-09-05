import React, { useState } from 'react';
import '../styles/AddStudent.css';

const AddStudent = ({ onAddStudent }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const { student_id, name, username, email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    // 1) Call backend to create user
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          StudentId: student_id,
          Username: username,
          Password: password,
          Name: name,
          Email: email,
          Role: 'student'
        })
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      const { Id } = await res.json();

      // 2) Update parent state
      onAddStudent({
        id: Id,
        student_id,
        name,
        email
      });

      // 3) Success feedback
      setMessage('✅ Student added successfully');
      setFormData({ student_id: '', name: '', username: '', email: '', password: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Add student error:', err);
      setMessage('❌ ' + err.message);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="add-student-container">
      <h2 className="form-title">Add New Student</h2>
      {message && <div className="form-success">{message}</div>}
      <form onSubmit={onSubmit} className="student-form">
        <div className="form-group">
          <label htmlFor="student_id">Student ID</label>
          <input
            type="text"
            id="student_id"
            name="student_id"
            value={student_id}
            onChange={onChange}
            required
            placeholder="Enter student ID"
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            required
            placeholder="Enter full name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={onChange}
            required
            placeholder="Enter username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Temporary Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            placeholder="Enter password"
          />
        </div>
        <button type="submit" className="submit-btn">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
