// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import Calendar from './Calendar';
import Assignments from './Assignments';
import Exams from './Exams';
import '../styles/StudentDashboard.css';

const StudentDashboard = ({ user, onLogout }) => {
  // State for courses
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  // State for events
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  // State for assignments
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [assignmentsError, setAssignmentsError] = useState(null);

  // State for the "View Details" modal
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch Courses
  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCourses(data);
        setLoadingCourses(false);
      })
      .catch(err => {
        console.error('Failed to fetch courses:', err);
        setCoursesError(err.message);
        setLoadingCourses(false);
      });
  }, []);

  // Fetch Events
  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setEvents(data);
        setLoadingEvents(false);
      })
      .catch(err => {
        console.error('Failed to fetch events:', err);
        setEventsError(err.message);
        setLoadingEvents(false);
      });
  }, []);

  // Fetch Assignments
  useEffect(() => {
    fetch('http://localhost:5000/api/assignments')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setAssignments(data);
        setLoadingAssignments(false);
      })
      .catch(err => {
        console.error('Failed to fetch assignments:', err);
        setAssignmentsError(err.message);
        setLoadingAssignments(false);
      });
  }, []);

  const handleViewDetails = course => {
    setSelectedCourse(course);
  };
  const closeModal = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <Navigation role="student" username={user.username} onLogout={onLogout} />
      </aside>

      <main className="dashboard-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Welcome, {user.username}</h1>

                {/* Current Courses */}
                <section id="current-courses">
                  <h2>Current Courses</h2>
                  {loadingCourses && <p>Loading courses…</p>}
                  {coursesError && <p className="error">Error: {coursesError}</p>}
                  <div className="course-grid">
                    {courses.map(course => (
                      <div key={course.Id} className="course-card">
                        <h3>{course.Title}</h3>
                        <p>Instructor: {course.Instructor}</p>
                        <p>Schedule: {course.Schedule}</p>
                        <button
                          className="btn-view"
                          onClick={() => handleViewDetails(course)}
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Upcoming Events */}
                <section id="upcoming-events">
                  <h2>Upcoming Events</h2>
                  {loadingEvents && <p>Loading events…</p>}
                  {eventsError && <p className="error">Error: {eventsError}</p>}
                  <div className="event-list">
                    {events
                      .filter(e => new Date(e.StartTime) > new Date())
                      .sort((a, b) => new Date(a.StartTime) - new Date(b.StartTime))
                      .slice(0, 5)
                      .map(evt => (
                        <div key={evt.Id} className="event-card">
                          <h3>{evt.Title}</h3>
                          <p>Category: {evt.Category}</p>
                          <p>Date: {new Date(evt.StartTime).toLocaleDateString()}</p>
                          <p>
                            Time:{' '}
                            {new Date(evt.StartTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ))}
                  </div>
                </section>

                {/* Assignments */}
                <section id="assignments">
                  <h2>Assignments</h2>
                  {loadingAssignments && <p>Loading assignments…</p>}
                  {assignmentsError && (
                    <p className="error">Error: {assignmentsError}</p>
                  )}
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map(asg => (
                        <tr key={asg.Id}>
                          <td>{asg.Title}</td>
                          <td>
                            {new Date(asg.DueDate).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td>{asg.Status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>

                {/* Calendar */}
                <section id="calendar">
                  <h2>Calendar</h2>
                  <Calendar isAdmin={false} events={events} />
                </section>

                {/* Course Details Modal */}
                {selectedCourse && (
                  <div className="modal-overlay" onClick={closeModal}>
                    <div
                      className="modal-content"
                      onClick={e => e.stopPropagation()}
                    >
                      <h2>{selectedCourse.Title}</h2>
                      <p>
                        <strong>Instructor:</strong> {selectedCourse.Instructor}
                      </p>
                      <p>
                        <strong>Schedule:</strong> {selectedCourse.Schedule}
                      </p>
                      <p>
                        <strong>Description:</strong> {selectedCourse.Description}
                      </p>
                      <button className="btn-close" onClick={closeModal}>
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </>
            }
          />

          {/* Other Routes */}
          <Route
            path="/calendar"
            element={<Calendar isAdmin={false} events={events} />}
          />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/exams" element={<Exams />} />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;
