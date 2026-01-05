import React from 'react';
import type { CalendarEvent } from '../types/calendar';
import { formatTime, getEventPosition } from '../utils/calendar';
import './EventCard.css';

interface EventCardProps {
  event: CalendarEvent;
  onClick: () => void;
  isDragging?: boolean;
  style?: React.CSSProperties;
  zIndex?: number;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onClick, 
  isDragging = false,
  style = {},
  zIndex = 1
}) => {
  const { top, height } = getEventPosition(event);
  const timeRange = `${formatTime(event.startTime)} – ${formatTime(event.endTime)}`;

  return (
    <div
      className={`event-card ${isDragging ? 'dragging' : ''}`}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: event.color,
        zIndex,
        ...style,
      }}
      onClick={onClick}
    >
      <div className="event-card-content">
        <div className="event-title">{event.title}</div>
        <div className="event-time">{timeRange}</div>
        {event.attendees.length > 0 && (
          <div className="event-attendees">
            {event.attendees.slice(0, 3).map((attendee, index) => (
              <img
                key={attendee.id}
                src={attendee.avatar}
                alt={attendee.name}
                className="attendee-avatar"
                style={{ marginLeft: index > 0 ? '-8px' : '0' }}
                title={attendee.name}
              />
            ))}
            {event.attendees.length > 3 && (
              <div className="attendee-more">+{event.attendees.length - 3}</div>
            )}
          </div>
        )}
      </div>
      <div className="resize-handle resize-handle-top" data-resize="top" />
      <div className="resize-handle resize-handle-bottom" data-resize="bottom" />
    </div>
  );
};
