import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css';


const Navigation = ({ role, username, onLogout }) => {
  return (
    <nav className="dashboard-sidebar">
      <div className="sidebar-header">
        <h2>{role === 'admin' ? 'Admin Panel' : 'Student Portal'}</h2>
        <p>{username}</p>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to={role === 'admin' ? '/admin' : '/student'}>Dashboard</Link>
        </li>
        <li>
          <Link to={role === 'admin' ? '/admin/calendar' : '/student/calendar'}>Calendar</Link>
        </li>
        
        {role === 'admin' && (
          <>
            <li>
              <Link to="/admin/add-student">Add Student</Link>
            </li>
            <li>
              <Link to="/admin/manage-events">Manage Events</Link>
            </li>
          </>
        )}
        
        {role === 'student' && (
          <>
            <li>
              <Link to="/student/assignments">Assignments</Link>
            </li>
            <li>
              <Link to="/student/exams">Exams</Link>
            </li>
          </>
        )}
        
        <li>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;