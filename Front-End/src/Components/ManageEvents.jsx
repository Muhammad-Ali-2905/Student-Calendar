// src/pages/ManageEvents.jsx
import React, { useState, useEffect } from 'react';
import '../styles/ManageEvents.css';

const ManageEvents = () => {
  const [categories, setCategories] = useState([]);
  const [events, setEvents]         = useState([]);
  const [formData, setFormData]     = useState({
    Title:       '',
    Description: '',
    StartTime:   '',   // for <input type="datetime-local">
    EndTime:     '',
    CategoryId:  '',
    Course:      ''
  });
  const [message, setMessage]       = useState('');
  const [editId, setEditId]         = useState(null);
  const [deleteId, setDeleteId]     = useState(null);

  // Utility: strip to "YYYY-MM-DDTHH:mm" for datetime-local
  const toInputValue = iso => (iso ? iso.substring(0, 16) : '');

  // Load categories & events on mount
  useEffect(() => {
    fetchCategories();
    fetchEvents();
  }, []);

  async function fetchCategories() {
    try {
      const res  = await fetch('http://localhost:5000/api/eventCategories');
      const data = await res.json();
      setCategories(data); // array of { Id, Name }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  }

  async function fetchEvents() {
    try {
      const res  = await fetch('http://localhost:5000/api/events');
      const data = await res.json();
      setEvents(data); // array of { Id, Title, Description, StartTime, EndTime, CategoryId, Course }
    } catch (err) {
      console.error('Failed to load events', err);
    }
  }

  // Handle form input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  }

  // Add or Update
  async function handleSubmit(e) {
    e.preventDefault();

    // Convert to "YYYY-MM-DDTHH:mm:ss"
    const payload = {
      ...formData,
      StartTime:  new Date(formData.StartTime).toISOString().substring(0, 19),
      EndTime:    new Date(formData.EndTime).toISOString().substring(0, 19),
      CategoryId: Number(formData.CategoryId)
    };

    try {
      let res;
      if (editId) {
        res = await fetch(`http://localhost:5000/api/events/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('http://localhost:5000/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMessage(editId ? '✏️ Event updated' : '✅ Event added');
      setEditId(null);
      setFormData({
        Title: '', Description: '', StartTime: '',
        EndTime: '', CategoryId: '', Course: ''
      });
      await fetchEvents();
    } catch (err) {
      console.error(err);
      setMessage('❌ Operation failed');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  }

  // Prepare to edit
  function openEditModal(ev) {
    setEditId(ev.Id);
    setFormData({
      Title:       ev.Title,
      Description: ev.Description || '',
      StartTime:   toInputValue(ev.StartTime),
      EndTime:     toInputValue(ev.EndTime),
      CategoryId:  ev.CategoryId.toString(),
      Course:      ev.Course
    });
  }

  // Prepare to delete
  function confirmDelete(id) {
    setDeleteId(id);
  }

  // Actually delete
  async function deleteEvent() {
    try {
      await fetch(`http://localhost:5000/api/events/${deleteId}`, { method: 'DELETE' });
      setMessage('🗑️ Event deleted');
      await fetchEvents();
    } catch (err) {
      console.error(err);
      setMessage('❌ Delete failed');
    } finally {
      setDeleteId(null);
      setTimeout(() => setMessage(''), 3000);
    }
  }

  return (
    <div className="manage-events-container">
      <h1 className="main-title">Manage Events</h1>

      {message && <div className="success-message">{message}</div>}

      {/* Add / Edit Form */}
      <div className="form-section">
        <h2 className="section-title">
          {editId ? 'Edit Event' : 'Add New Event'}
        </h2>
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label>Title</label>
            <input
              name="Title"
              value={formData.Title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="datetime-local"
              name="StartTime"
              value={formData.StartTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input
              type="datetime-local"
              name="EndTime"
              value={formData.EndTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="CategoryId"
              value={formData.CategoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c.Id} value={c.Id}>
                  {c.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Course</label>
            <input
              name="Course"
              value={formData.Course}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            {editId ? 'Save Changes' : 'Add Event'}
          </button>
          {editId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditId(null);
                setFormData({
                  Title: '', Description: '',
                  StartTime: '', EndTime: '',
                  CategoryId: '', Course: ''
                });
              }}
              style={{ marginLeft: '8px' }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Events Table */}
      <h2 className="section-title">Existing Events</h2>
      <table className="events-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Course</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => (
            <tr key={e.Id}>
              <td>{e.Title}</td>
              <td>{categories.find(c => c.Id === e.CategoryId)?.Name}</td>
              <td>{e.Course}</td>
              <td>{new Date(e.StartTime).toLocaleString()}</td>
              <td>{new Date(e.EndTime).toLocaleString()}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => openEditModal(e)}>
                  Edit
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => confirmDelete(e.Id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this event?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={deleteEvent}>
                Yes, Delete
              </button>
              <button
                className="cancel-btn"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
