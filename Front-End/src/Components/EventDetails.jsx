// src/components/ManageEvents.jsx
import React, { useState, useEffect } from 'react';
import EventDetails from './EventDetails';
import '../styles/ManageEvents.css';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    category: ''
  });
  const [message, setMessage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 1) Fetch existing events on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
      })
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  // Handle form input
  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 2) Submit new event
  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      const newEvent = await res.json(); // assume it returns the created row
      setEvents(prev => [...prev, newEvent]);
      setMessage('✅ Event added!');
      setForm({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        category: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('❌ ' + err.message);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="manage-events-container">
      <h2>Add New Event</h2>
      {message && <div className="form-message">{message}</div>}

      <form onSubmit={onSubmit} className="event-form">
        <label>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={onChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
        />

        <label>Start Time</label>
        <input
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={onChange}
          required
        />

        <label>End Time</label>
        <input
          type="datetime-local"
          name="end_time"
          value={form.end_time}
          onChange={onChange}
          required
        />

        <label>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={onChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Lecture">Lecture</option>
          <option value="Workshop">Workshop</option>
          <option value="Exam">Exam</option>
          {/* …add your other categories */}
        </select>

        <button type="submit" className="submit-btn">
          Add Event
        </button>
      </form>

      <h2 className="section-title">Existing Events</h2>
      <ul className="events-list">
        {events.map(evt => (
          <li key={evt.Id} className="event-item">
            <span>{evt.Title}</span>
            <button
              className="view-btn"
              onClick={() => setSelectedEvent(evt)}
            >
              View Details
            </button>
          </li>
        ))}
      </ul>

      {/* 3) Detail Modal */}
      <EventDetails
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};

export default ManageEvents;
