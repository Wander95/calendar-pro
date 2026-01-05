import type { CalendarEvent } from '../types/calendar';

export const HOUR_HEIGHT = 60; // pixels per hour
export const TIME_SLOT_MINUTES = 15; // snap to 15-minute intervals
export const START_HOUR = 6; // Start at 6 AM
export const END_HOUR = 22; // End at 10 PM
export const MAX_BOOKING_HOUR = 18; // Maximum booking time at 6 PM

export function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    const period = hour >= 12 ? 'PM' : 'AM';
    let displayHour = hour;
    if (hour > 12) {
      displayHour = hour - 12;
    } else if (hour === 0) {
      displayHour = 12;
    }
    slots.push(`${displayHour} ${period}`);
  }
  return slots;
}

export function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }
  return days;
}

export function formatDate(date: Date): string {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return `${days[date.getDay()]} ${date.getDate()}`;
}

export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHour}:${displayMinutes} ${period}`;
}

export function getEventPosition(event: CalendarEvent): { top: number; height: number } {
  const startHour = event.startTime.getHours() + event.startTime.getMinutes() / 60;
  const endHour = event.endTime.getHours() + event.endTime.getMinutes() / 60;
  
  const top = (startHour - START_HOUR) * HOUR_HEIGHT;
  const height = (endHour - startHour) * HOUR_HEIGHT;
  
  return { top, height };
}

export function getTimeFromPosition(yPosition: number): Date {
  const hours = START_HOUR + (yPosition / HOUR_HEIGHT);
  const totalMinutes = hours * 60;
  
  // Snap to TIME_SLOT_MINUTES intervals
  const snappedMinutes = Math.round(totalMinutes / TIME_SLOT_MINUTES) * TIME_SLOT_MINUTES;
  
  const date = new Date();
  date.setHours(Math.floor(snappedMinutes / 60), snappedMinutes % 60, 0, 0);
  
  return date;
}

export function getDayFromPosition(xPosition: number, containerWidth: number): number {
  return Math.floor((xPosition / containerWidth) * 7);
}

export function findOverlappingEvents(events: CalendarEvent[], targetEvent: CalendarEvent): CalendarEvent[] {
  return events.filter(event => {
    if (event.id === targetEvent.id) return false;
    
    // Check if events are on the same day
    const sameDay = event.startTime.toDateString() === targetEvent.startTime.toDateString();
    if (!sameDay) return false;
    
    // Check if events overlap in time
    const overlaps = 
      (event.startTime < targetEvent.endTime && event.endTime > targetEvent.startTime);
    
    return overlaps;
  });
}

export function getMaxBookingPosition(): number {
  return (MAX_BOOKING_HOUR - START_HOUR) * HOUR_HEIGHT;
}

export function isWithinMaxBookingTime(time: Date): boolean {
  const hours = time.getHours() + time.getMinutes() / 60;
  return hours <= MAX_BOOKING_HOUR;
}
