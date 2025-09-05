import React, { useState } from 'react';
import '../styles/Calendar.css';

const Calendar = ({ isAdmin, events = [] }) => {
  const [currentDate] = useState(new Date());
  const [currentMonth] = useState(currentDate.getMonth());
  const [currentYear] = useState(currentDate.getFullYear());

  // Calculate days in month and first day of month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Create calendar days array
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null); // Empty cells for days before the 1st of the month
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Helper to check if two dates are the same day (ignoring time and timezone)
  const isSameDay = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  // Filter today's events based on StartTime property
  const todayEvents = events.filter(event => {
    // Use event.StartTime or event.start_time depending on your data structure
    const eventDate = new Date(event.StartTime || event.start_time);
    return isSameDay(eventDate, currentDate);
  });

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h3>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}</h3>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="calendar-days">
          {days.map((day, index) => (
            <div 
              key={index} 
              className={`calendar-day ${day === currentDate.getDate() ? 'current-day' : ''} ${!day ? 'empty-day' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="today-events">
        <h3>Today's Events</h3>
        {todayEvents.length > 0 ? (
          <div className="event-list">
            {todayEvents.map(event => (
              <div key={event.Id || event.id} className="event-item">
                <span className="event-time">
                  {new Date(event.StartTime || event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="event-title">{event.Title || event.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No events scheduled for today</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;
