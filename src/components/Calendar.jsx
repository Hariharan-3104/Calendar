

import React from "react";
import dayjs from "dayjs";

// You can define a palette for event colors
const EVENT_COLORS = [
  "#ef4444",
  "#eab308", 
  
  "#2563eb", 
  "#10b981", 
  "#a21caf", 
  "#f97316", 
  "#0ea5e9",
];

const Calendar = ({ month, year, events, onDayClick }) => {
  const startOfMonth = dayjs(`${year}-${month}-01`);
  const startDay = startOfMonth.day();
  const daysInMonth = startOfMonth.daysInMonth();
  const today = dayjs().format("YYYY-MM-DD");

  const days = [];

  
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="day-cell empty" />);
  }

  
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = String(d).padStart(2, '0');
    const fullDate = `${year}-${month}-${dayStr}`;
    const isToday = fullDate === today;
    const dayEvents = events.filter(e => e.date === fullDate);
    const hasEvent = dayEvents.length > 0;

    days.push(
      <div
        key={d}
        className={`day-cell${isToday ? " today" : ""}${hasEvent ? " has-event" : ""}`}
        title={fullDate}
        onClick={() => onDayClick && onDayClick(fullDate, dayEvents)}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        {d}
        {hasEvent && (
          <span className="event-dots">
            {dayEvents.slice(0, 5).map((event, idx) => (
              <span
                key={idx}
                className="event-dot"
                style={{ background: EVENT_COLORS[idx % EVENT_COLORS.length] }}
                title={event.title}
              />
            ))}
            {dayEvents.length > 5 && (
              <span style={{
                fontSize: "0.7em",
                color: "#888",
                marginLeft: 2,
                fontWeight: "bold"
              }}>+{dayEvents.length - 5}</span>
            )}
          </span>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
          <div key={idx} className="day-name">{day}</div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default Calendar;