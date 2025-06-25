

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Header from "./components/Header.jsx";
import Calendar from "./components/Calendar.jsx";
import Modal from "./components/Modal.jsx";
import initialEvents from "./data/events.json";
import "./App.css";

const App = () => {
  const [date, setDate] = useState(dayjs());
  const [events, setEvents] = useState(initialEvents);

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showPlannedModal, setShowPlannedModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);

  // State for day event modal
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [showDayEventModal, setShowDayEventModal] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    start: "",
    end: ""
  });

  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [editEventData, setEditEventData] = useState({
    title: "",
    date: "",
    start: "",
    end: ""
  });

  const handlePrev = () => setDate(prev => prev.subtract(1, "month"));
  const handleNext = () => setDate(prev => prev.add(1, "month"));

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.start || !newEvent.end) {
      alert("Please fill all fields!");
      return;
    }
    setEvents(prev => [...prev, newEvent]);
    setNewEvent({ title: "", date: "", start: "", end: "" });
    setShowAddEventModal(false);
  };

  const currentMonth = date.format("MM");
  const currentYear = date.format("YYYY");

  const filteredEvents = events.filter(e => {
    const eventDate = dayjs(e.date);
    return (
      eventDate.format("MM") === currentMonth &&
      eventDate.format("YYYY") === currentYear
    );
  });

  useEffect(() => {
    const handleMonthYearUpdate = (e) => {
      const newDate = dayjs(e.detail);
      setDate(newDate);
    };
    window.addEventListener("updateMonthYear", handleMonthYearUpdate);
    return () => window.removeEventListener("updateMonthYear", handleMonthYearUpdate);
  }, []);

  // Handler for day click
  const handleDayClick = (date, dayEvents) => {
    setSelectedDayEvents(dayEvents);
    setShowDayEventModal(true);
  };

  return (
    <>
      <h1 className="top-calendar-heading">Calendar</h1>
      <div className="app-container">
        <div className="calendar-section">
          <Header
            date={date}
            onPrev={handlePrev}
            onNext={handleNext}
          />
          <Calendar
            month={currentMonth}
            year={currentYear}
            events={events}
            onDayClick={handleDayClick}
          />

          <div className="button-container">
            <button className="primary" onClick={() => setShowAddEventModal(true)}>
              ➕ Add Event
            </button>
            <button className="primary" onClick={() => setShowPlannedModal(true)}>
              📋 See Planned Events
            </button>
            <button className="primary" onClick={() => setShowYearModal(true)}>
              🗓️ Year Calendar
            </button>
          </div>
        </div>

        <div className="events-panel">
          <div>
            <h2>Events</h2>
            {filteredEvents.length === 0 ? (
              <p className="text-sm text-gray-400">No events this month</p>
            ) : (
              filteredEvents.map((event, index) => (
                <div key={index} className="event-item improved-event">
                  <div className="event-title">🎉 {event.title}</div>
                  <button
                    className="edit-button"
                    onClick={() => {
                      setEditEventData(event);
                      setEditingEventIndex(index);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/*  Add Event Modal */}
        <Modal
          isOpen={showAddEventModal}
          title="Add New Event"
          onClose={() => setShowAddEventModal(false)}
        >
          <form onSubmit={handleAddEvent} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
              className="border p-1"
              required
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
              className="border p-1"
              required
            />
            <input
              type="time"
              value={newEvent.start}
              onChange={e => setNewEvent({ ...newEvent, start: e.target.value })}
              className="border p-1"
              required
            />
            <input
              type="time"
              value={newEvent.end}
              onChange={e => setNewEvent({ ...newEvent, end: e.target.value })}
              className="border p-1"
              required
            />
            <button type="submit" className="primary">Add Event</button>
          </form>
        </Modal>

        {/*  Planned Events Modal */}
        <Modal
          isOpen={showPlannedModal}
          title="Planned Events"
          onClose={() => setShowPlannedModal(false)}
        >
          {filteredEvents.length === 0 ? (
            <p className="text-gray-500 text-center">No events planned for this month.</p>
          ) : (
            <div className="planned-events-list">
              {filteredEvents.map((event, index) => (
                <div key={index} className="planned-event-card">
                  <h3 className="event-title">🎉 {event.title}</h3>
                  <p className="event-detail">📅 <strong>Date:</strong> {event.date}</p>
                  <p className="event-detail">⏰ <strong>Time:</strong> {event.start} - {event.end}</p>
                </div>
              ))}
            </div>
          )}
        </Modal>

        {/*  Year Calendar Modal */}
        <Modal
          isOpen={showYearModal}
          title={`Year Calendar - ${currentYear}`}
          onClose={() => setShowYearModal(false)}
        >
          <div className="year-calendar-modal-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="year-calendar-month-box">
                <h4>
                  {dayjs().month(i).format("MMMM")}
                </h4>
                <Calendar
                  month={String(i + 1).padStart(2, "0")}
                  year={currentYear}
                  events={events}
                  onDayClick={handleDayClick}
                />
              </div>
            ))}
          </div>
        </Modal>

        {/*  Edit Modal */}
        <Modal
          isOpen={showEditModal}
          title="Edit Event"
          onClose={() => setShowEditModal(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updatedEvents = [...events];
              updatedEvents[editingEventIndex] = editEventData;
              setEvents(updatedEvents);
              setShowEditModal(false);
            }}
            className="flex flex-col gap-2"
          >
            <input
              type="text"
              value={editEventData.title}
              onChange={(e) =>
                setEditEventData({ ...editEventData, title: e.target.value })
              }
              className="border p-1"
              required
            />
            <input
              type="date"
              value={editEventData.date}
              onChange={(e) =>
                setEditEventData({ ...editEventData, date: e.target.value })
              }
              className="border p-1"
              required
            />
            <input
              type="time"
              value={editEventData.start}
              onChange={(e) =>
                setEditEventData({ ...editEventData, start: e.target.value })
              }
              className="border p-1"
              required
            />
            <input
              type="time"
              value={editEventData.end}
              onChange={(e) =>
                setEditEventData({ ...editEventData, end: e.target.value })
              }
              className="border p-1"
              required
            />
            <button type="submit" className="primary">Save Changes</button>
          </form>
        </Modal>

        {/* Day Event Modal */}
        <Modal
          isOpen={showDayEventModal}
          title="Events for this day"
          onClose={() => setShowDayEventModal(false)}
        >
          {selectedDayEvents.length === 0 ? (
            <p>No events for this day.</p>
          ) : (
            <ul>
              {selectedDayEvents.map((event, idx) => (
                <li key={idx} style={{marginBottom: 8}}>
                  <strong>{event.title}</strong><br/>
                  {event.start} - {event.end}
                </li>
              ))}
            </ul>
          )}
        </Modal>
      </div>
    </>
  );
};

export default App;