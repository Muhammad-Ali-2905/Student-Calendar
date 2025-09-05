import React, { useState, useEffect } from 'react';
import '../styles/Exams.css';

const Exams = () => {
  // 1) start with empty array
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  // 2) fetch exams on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/exams')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch exams');
        return res.json();
      })
      .then(data => {
        const mapped = data.map(item => ({
          id:        item.Id,
          title:     item.Title,
          course:    item.Course,
          date:      // if SQL DATE comes as string or ISO,
                     typeof item.ExamDate === 'string'
                       ? item.ExamDate.slice(0, 10)
                       : new Date(item.ExamDate).toISOString().slice(0, 10),
          time:      item.ExamTime
                       // SQL TIME serialized as ISO string starting with 1970-...Txx:yy
                       ? (typeof item.ExamTime === 'string'
                           ? item.ExamTime.slice(11, 16)
                           : new Date(item.ExamTime).toISOString().slice(11, 16)
                         )
                       : '',
          location:  item.Location,
          materials: item.Materials
        }));
        setExams(mapped);
      })
      .catch(err => console.error('Error fetching exams:', err));
  }, []);

  const openDialog = (exam) => {
    setSelectedExam(exam);
  };

  const closeDialog = () => {
    setSelectedExam(null);
  };

  return (
    <div className="exams-container">
      <h1>Upcoming Exams</h1>

      <div className="exam-list">
        {exams.map(exam => (
          <div key={exam.id} className="event-card">
            <h3>{exam.title}</h3>
            <p><strong>Course:</strong> {exam.course}</p>
            <p><strong>Date:</strong> {exam.date}</p>
            <p><strong>Time:</strong> {exam.time}</p>
            <p><strong>Location:</strong> {exam.location}</p>
            <div className="card-actions">
              <button className="btn-edit" onClick={() => openDialog(exam)}>
                Study Materials
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog Box */}
      {selectedExam && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>{selectedExam.title} – Study Materials</h3>
            <p><strong>Course:</strong> {selectedExam.course}</p>
            <p>{selectedExam.materials}</p>
            <button className="btn-cancel" onClick={closeDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
