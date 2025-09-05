import React, { useState, useEffect } from 'react';
import '../styles/Assignment.css';

const Assignments = () => {
  // start with empty list
  const [assignments, setAssignments] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // fetch assignments on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/assignments')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch assignments');
        return res.json();
      })
      .then(data => {
        const mapped = data.map(item => ({
          id:      item.Id,
          title:   item.Title,
          course:  item.Course,
          dueDate: item.DueDate.slice(0, 10),
          status:  item.Status
        }));
        setAssignments(mapped);
      })
      .catch(err => console.error('Error loading assignments:', err));
  }, []);

  const openDialog = id => {
    setSelectedId(id);
    setShowDialog(true);
  };

  const confirmSubmit = () => {
    // find the assignment to update
    const toUpdate = assignments.find(a => a.id === selectedId);
    if (!toUpdate) return;

    // call API to persist status change
    fetch(`http://localhost:5000/api/assignments/${selectedId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Title:  toUpdate.title,
        Course: toUpdate.course,
        DueDate: toUpdate.dueDate,
        Status: 'Submitted'
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to update assignment');
      // on success, update local UI
      setAssignments(prev =>
        prev.map(a =>
          a.id === selectedId ? { ...a, status: 'Submitted' } : a
        )
      );
    })
    .catch(err => console.error('Submit error:', err));

    // close dialog
    setShowDialog(false);
    setSelectedId(null);
  };

  const cancelDialog = () => {
    setShowDialog(false);
    setSelectedId(null);
  };

  return (
    <div className="assignments-container">
      <h1>My Assignments</h1>

      <div className="filter-options">
        <select defaultValue="all">
          <option value="all">All Assignments</option>
          <option value="pending">Pending</option>
          <option value="submitted">Submitted</option>
          <option value="graded">Graded</option>
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Course</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.course}</td>
              <td>{a.dueDate}</td>
              <td>
                <span className={`status ${a.status.toLowerCase()}`}>{a.status}</span>
              </td>
              <td>
                {a.status === 'Pending' && (
                  <button className="btn-edit" onClick={() => openDialog(a.id)}>
                    Submit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>Are you sure you want to submit this assignment?</p>
            <div className="dialog-buttons">
              <button className="btn-confirm" onClick={confirmSubmit}>Yes, Submit</button>
              <button className="btn-cancel" onClick={cancelDialog}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
