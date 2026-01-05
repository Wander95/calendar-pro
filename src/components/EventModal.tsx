import React, { useState } from 'react';
import type { CalendarEvent } from '../types/calendar';
import './EventModal.css';

interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose, onSave }) => {
  const getInitialValues = () => {
    if (!event) return { title: '', date: '', startTime: '', endTime: '' };
    
    const dateStr = event.startTime.toISOString().split('T')[0];
    const startHours = event.startTime.getHours().toString().padStart(2, '0');
    const startMinutes = event.startTime.getMinutes().toString().padStart(2, '0');
    const endHours = event.endTime.getHours().toString().padStart(2, '0');
    const endMinutes = event.endTime.getMinutes().toString().padStart(2, '0');
    
    return {
      title: event.title,
      date: dateStr,
      startTime: `${startHours}:${startMinutes}`,
      endTime: `${endHours}:${endMinutes}`
    };
  };

  const initialValues = getInitialValues();
  const [title, setTitle] = useState(initialValues.title);
  const [date, setDate] = useState(initialValues.date);
  const [startTime, setStartTime] = useState(initialValues.startTime);
  const [endTime, setEndTime] = useState(initialValues.endTime);

  // Reset form when event changes
  React.useEffect(() => {
    if (event && isOpen) {
      const newValues = getInitialValues();
      setTitle(newValues.title);
      setDate(newValues.date);
      setStartTime(newValues.startTime);
      setEndTime(newValues.endTime);
    }
  }, [event?.id, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen || !event) return null;

  const handleSave = () => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const newStartTime = new Date(date);
    newStartTime.setHours(startHours, startMinutes, 0, 0);
    
    const newEndTime = new Date(date);
    newEndTime.setHours(endHours, endMinutes, 0, 0);

    onSave({
      ...event,
      title,
      startTime: newStartTime,
      endTime: newEndTime,
    });
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Event</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start-time">Start Time</label>
              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="end-time">End Time</label>
              <input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Attendees</label>
            <div className="attendees-list">
              {event.attendees.map((attendee) => (
                <div key={attendee.id} className="attendee-item">
                  <img src={attendee.avatar} alt={attendee.name} />
                  <span>{attendee.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="button button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button button-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
