import React, { useState, useRef, useCallback } from 'react';
import type { CalendarEvent } from '../types/calendar';
import { EventCard } from './EventCard';
import { EventModal } from './EventModal';
import {
  getTimeSlots,
  getWeekDays,
  formatDate,
  getEventPosition,
  findOverlappingEvents,
  getMaxBookingPosition,
  isWithinMaxBookingTime,
  HOUR_HEIGHT,
  START_HOUR,
} from '../utils/calendar';
import './WeekView.css';

interface WeekViewProps {
  events: CalendarEvent[];
  onUpdateEvent: (event: CalendarEvent) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ events, onUpdateEvent }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggingEventId, setDraggingEventId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{
    type: 'move' | 'resize-top' | 'resize-bottom';
    initialY: number;
    initialMouseY: number;
    initialStartTime: Date;
    initialEndTime: Date;
    dayIndex: number;
  } | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  const timeSlots = getTimeSlots();
  const weekDays = getWeekDays(currentWeekStart);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
  };

  const getMonthYearDisplay = () => {
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(currentWeekStart.getDate() + 6);

    const startMonth = currentWeekStart.toLocaleString('default', { month: 'long' });
    const endMonth = endOfWeek.toLocaleString('default', { month: 'long' });
    const year = currentWeekStart.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${year}`;
    } else {
      return `${startMonth} - ${endMonth} ${year}`;
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (!draggingEventId) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, event: CalendarEvent, type: 'move' | 'resize-top' | 'resize-bottom') => {
    e.stopPropagation();
    
    const target = e.currentTarget as HTMLElement;
    const dayColumn = target.closest('.day-column') as HTMLElement;
    const parent = dayColumn.parentElement;
    if (!parent) return;
    
    const dayIndex = Array.from(parent.children).indexOf(dayColumn) - 1;

    setDraggingEventId(event.id);
    setDragState({
      type,
      initialY: getEventPosition(event).top,
      initialMouseY: e.clientY,
      initialStartTime: new Date(event.startTime),
      initialEndTime: new Date(event.endTime),
      dayIndex,
    });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState || !draggingEventId) return;

    const deltaY = e.clientY - dragState.initialMouseY;
    const event = events.find(ev => ev.id === draggingEventId);
    if (!event) return;

    const newEvent = { ...event };

    if (dragState.type === 'move') {
      // Calculate new time based on vertical movement
      const newTop = Math.max(0, dragState.initialY + deltaY);
      const newStartHours = START_HOUR + (newTop / HOUR_HEIGHT);
      const newStartMinutes = Math.round((newStartHours * 60) / 15) * 15;

      const duration = event.endTime.getTime() - event.startTime.getTime();

      const newStartTime = new Date(event.startTime);
      newStartTime.setHours(Math.floor(newStartMinutes / 60), newStartMinutes % 60, 0, 0);

      const newEndTime = new Date(newStartTime.getTime() + duration);

      // Check if within max booking time
      if (isWithinMaxBookingTime(newEndTime)) {
        newEvent.startTime = newStartTime;
        newEvent.endTime = newEndTime;

        // Handle horizontal day change
        if (gridRef.current) {
          const rect = gridRef.current.getBoundingClientRect();
          const relativeX = e.clientX - rect.left - 60; // Subtract time column width
          const dayColumnWidth = (rect.width - 60) / 7;
          const newDayIndex = Math.max(0, Math.min(6, Math.floor(relativeX / dayColumnWidth)));

          if (newDayIndex !== dragState.dayIndex) {
            const dayDiff = newDayIndex - dragState.dayIndex;
            const newDate = new Date(newStartTime);
            newDate.setDate(newDate.getDate() + dayDiff);

            const newEndDate = new Date(newEndTime);
            newEndDate.setDate(newEndDate.getDate() + dayDiff);

            newEvent.startTime = newDate;
            newEvent.endTime = newEndDate;
          }
        }

        onUpdateEvent(newEvent);
      }
    } else if (dragState.type === 'resize-top') {
      const newTop = Math.max(0, dragState.initialY + deltaY);
      const newStartHours = START_HOUR + (newTop / HOUR_HEIGHT);
      const newStartMinutes = Math.round((newStartHours * 60) / 15) * 15;

      const newStartTime = new Date(event.startTime);
      newStartTime.setHours(Math.floor(newStartMinutes / 60), newStartMinutes % 60, 0, 0);

      if (newStartTime < event.endTime) {
        newEvent.startTime = newStartTime;
        onUpdateEvent(newEvent);
      }
    } else if (dragState.type === 'resize-bottom') {
      const currentBottom = dragState.initialY + getEventPosition(event).height;
      const newBottom = Math.max(dragState.initialY + 30, currentBottom + deltaY);
      const newEndHours = START_HOUR + (newBottom / HOUR_HEIGHT);
      const newEndMinutes = Math.round((newEndHours * 60) / 15) * 15;

      const newEndTime = new Date(event.endTime);
      newEndTime.setHours(Math.floor(newEndMinutes / 60), newEndMinutes % 60, 0, 0);

      if (newEndTime > event.startTime && isWithinMaxBookingTime(newEndTime)) {
        newEvent.endTime = newEndTime;
        onUpdateEvent(newEvent);
      }
    }
  }, [dragState, draggingEventId, events, onUpdateEvent]);

  const handleMouseUp = useCallback(() => {
    setDraggingEventId(null);
    setDragState(null);
  }, []);

  React.useEffect(() => {
    if (draggingEventId) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingEventId, handleMouseMove, handleMouseUp]);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = event.startTime.toDateString();
      const dayDate = day.toDateString();
      return eventDate === dayDate;
    });
  };

  const getEventZIndex = (event: CalendarEvent, dayEvents: CalendarEvent[]): number => {
    const overlapping = findOverlappingEvents(dayEvents, event);
    if (overlapping.length === 0) return 1;

    // Events that start later should be on top
    const sortedEvents = [event, ...overlapping].sort((a, b) => 
      a.startTime.getTime() - b.startTime.getTime()
    );
    
    return sortedEvents.indexOf(event) + 1;
  };

  const maxBookingPosition = getMaxBookingPosition();

  return (
    <div className="week-view">
      <div className="week-view-header">
        <h1 className="month-year">{getMonthYearDisplay()}</h1>
        <div className="nav-controls">
          <button className="nav-button" onClick={goToToday}>Today</button>
          <button className="nav-button" onClick={() => navigateWeek('prev')}>‹</button>
          <button className="nav-button" onClick={() => navigateWeek('next')}>›</button>
        </div>
      </div>

      <div className="calendar-grid" ref={gridRef}>
        <div className="time-column">
          <div className="time-header"></div>
          {timeSlots.map((slot, index) => (
            <div key={index} className="time-slot" style={{ height: `${HOUR_HEIGHT}px` }}>
              <span className="time-label">{slot}</span>
            </div>
          ))}
        </div>

        {weekDays.map((day, dayIndex) => {
          const dayEvents = getEventsForDay(day);
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div key={dayIndex} className={`day-column ${isToday ? 'today' : ''}`}>
              <div className="day-header">
                <div className="day-name">{formatDate(day).split(' ')[0]}</div>
                <div className={`day-number ${isToday ? 'today-number' : ''}`}>
                  {formatDate(day).split(' ')[1]}
                </div>
              </div>

              <div className="day-events" style={{ position: 'relative', height: `${timeSlots.length * HOUR_HEIGHT}px` }}>
                {/* Max booking time indicator */}
                <div 
                  className="max-booking-line" 
                  style={{ top: `${maxBookingPosition}px` }}
                />

                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className="event-wrapper"
                    onMouseDown={(e) => {
                      const target = e.target as HTMLElement;
                      const resizeType = target.getAttribute('data-resize');
                      if (resizeType === 'top') {
                        handleMouseDown(e, event, 'resize-top');
                      } else if (resizeType === 'bottom') {
                        handleMouseDown(e, event, 'resize-bottom');
                      } else if (!resizeType) {
                        handleMouseDown(e, event, 'move');
                      }
                    }}
                  >
                    <EventCard
                      event={event}
                      onClick={() => handleEventClick(event)}
                      isDragging={event.id === draggingEventId}
                      zIndex={getEventZIndex(event, dayEvents)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onUpdateEvent}
      />
    </div>
  );
};
