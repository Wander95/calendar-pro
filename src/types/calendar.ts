export interface Attendee {
  id: string;
  name: string;
  avatar: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  attendees: Attendee[];
  color: string;
}

export interface DragData {
  eventId: string;
  type: 'move' | 'resize-top' | 'resize-bottom';
  initialY?: number;
  initialStartTime?: Date;
  initialEndTime?: Date;
}
