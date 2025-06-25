
import React from "react";

const Day = ({ date, isToday, events }) => {
  const hasEvent = events.length > 0;

  return (
    <div
      className={`day-cell ${isToday ? "today" : ""} ${hasEvent ? "has-event" : ""}`}
    >
      <div className="date-label">{date}</div>
      <div className="flex flex-col gap-1 mt-1">
        {events.map((event, idx) => (
          <div key={idx} className="event-dot" title={`${event.start} - ${event.end}`}>
            {/* Optional: display time range inside calendar */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Day;


