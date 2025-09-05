// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import AddStudent from './AddStudent';
import ManageEvents from './ManageEvents';
import Calendar from './Calendar';
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  // State for students
  const [students, setStudents] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState(null);

  // State for events & courses
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // State for editing a student
  const [editingStudent, setEditingStudent] = useState(null);
  const [editError, setEditError] = useState(null);

  // Fetch all users and filter only students
  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => {
        if (!res.ok) throw new Error(`Users HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const onlyStudents = data.filter(u => u.Role?.toLowerCase() === 'student');
        setStudents(onlyStudents);
      })
      .catch(err => {
        console.error('Failed to fetch users:', err);
        setUsersError(err.message);
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  // Fetch all events
  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => {
        if (!res.ok) throw new Error(`Events HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setEvents(data))
      .catch(err => console.error('Failed to fetch events:', err))
      .finally(() => setLoadingEvents(false));
  }, []);

  // Fetch all courses
  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => {
        if (!res.ok) throw new Error(`Courses HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setCourses(data))
      .catch(err => console.error('Failed to fetch courses:', err))
      .finally(() => setLoadingCourses(false));
  }, []);

  // Open edit modal
  const handleEditClick = student => {
    setEditError(null);
    setEditingStudent({ ...student });
  };

  // Track form changes
  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditingStudent(prev => ({ ...prev, [name]: value }));
  };

  // Submit PUT to update student
  const handleEditSubmit = async e => {
    e.preventDefault();
    if (!editingStudent) return;

    setEditError(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${editingStudent.Id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Name: editingStudent.Name,
            Email: editingStudent.Email
          })
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }

      // Update local state
      setStudents(prev =>
        prev.map(u =>
          u.Id === editingStudent.Id ? { ...u, ...editingStudent } : u
        )
      );
      setEditingStudent(null);
    } catch (err) {
      console.error('Failed to update student:', err);
      setEditError('Could not save changes. Please try again.');
    }
  };

  // Compute dashboard stats
  const totalStudents = students.length;
  const upcomingEventsCount = events.filter(
    evt => new Date(evt.StartTime) > new Date()
  ).length;
  const totalCourses = courses.length;

  return (
    <div className="admin-dashboard-container">
      <Navigation role="admin" username={user.username} onLogout={onLogout} />
      <main className="admin-dashboard-content">
        <Routes>
          <Route
            path="/"
            element={
              <div className="dashboard-home">
                <h1>Welcome to Admin Dashboard</h1>

                <div className="admin-stats">
                  <div className="stat-card">
                    <h3>Total Students</h3>
                    {loadingUsers ? <p>…</p>
                      : usersError ? <p className="error">{usersError}</p>
                      : <p>{totalStudents}</p>}
                  </div>
                  <div className="stat-card">
                    <h3>Upcoming Events</h3>
                    {loadingEvents ? <p>…</p> : <p>{upcomingEventsCount}</p>}
                  </div>
                  <div className="stat-card">
                    <h3>Courses</h3>
                    {loadingCourses ? <p>…</p> : <p>{totalCourses}</p>}
                  </div>
                </div>

                <h2>Student List</h2>
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.Id}>
                        <td>{student.StudentId}</td>
                        <td>{student.Name}</td>
                        <td>{student.Email}</td>
                        <td>
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEditClick(student)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Edit Student Modal */}
                {editingStudent && (
                  <div className="modal-overlay" onClick={() => setEditingStudent(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                      <h2>Edit Student</h2>
                      <form onSubmit={handleEditSubmit}>
                        <div className="modal-field">
                          <label htmlFor="Name">Name:</label>
                          <input
                            id="Name"
                            type="text"
                            name="Name"
                            value={editingStudent.Name}
                            onChange={handleEditChange}
                            required
                          />
                        </div>
                        <div className="modal-field">
                          <label htmlFor="Email">Email:</label>
                          <input
                            id="Email"
                            type="email"
                            name="Email"
                            value={editingStudent.Email}
                            onChange={handleEditChange}
                            required
                          />
                        </div>
                        {editError && <p className="error">{editError}</p>}
                        <div className="modal-actions">
                          <button type="submit" className="save-btn">
                            Save
                          </button>
                          <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setEditingStudent(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            }
          />
          <Route path="/calendar" element={<Calendar isAdmin events={events} />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/manage-events" element={<ManageEvents events={events} />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
