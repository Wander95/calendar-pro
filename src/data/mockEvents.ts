import type { CalendarEvent, Attendee } from '../types/calendar';

// Mock avatars - using UI Avatars service for placeholder avatars
const attendees: Attendee[] = [
  { id: '1', name: 'Alice Johnson', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=4F46E5&color=fff' },
  { id: '2', name: 'Bob Smith', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=DC2626&color=fff' },
  { id: '3', name: 'Carol White', avatar: 'https://ui-avatars.com/api/?name=Carol+White&background=059669&color=fff' },
  { id: '4', name: 'David Brown', avatar: 'https://ui-avatars.com/api/?name=David+Brown&background=D97706&color=fff' },
  { id: '5', name: 'Eva Green', avatar: 'https://ui-avatars.com/api/?name=Eva+Green&background=7C3AED&color=fff' },
  { id: '6', name: 'Frank Miller', avatar: 'https://ui-avatars.com/api/?name=Frank+Miller&background=0891B2&color=fff' },
];

// Generate events for a week
const today = new Date();
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

export const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    startTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 9, 0),
    endTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 9, 30),
    attendees: [attendees[0], attendees[1], attendees[2]],
    color: '#3B82F6',
  },
  {
    id: '2',
    title: 'Design Review',
    startTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 10, 0),
    endTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 11, 30),
    attendees: [attendees[0], attendees[3]],
    color: '#8B5CF6',
  },
  {
    id: '3',
    title: 'Client Meeting',
    startTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 14, 0),
    endTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 15, 0),
    attendees: [attendees[1], attendees[4], attendees[5]],
    color: '#10B981',
  },
  {
    id: '4',
    title: 'Sprint Planning',
    startTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 10, 0),
    endTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 12, 0),
    attendees: [attendees[0], attendees[1], attendees[2], attendees[3]],
    color: '#F59E0B',
  },
  {
    id: '5',
    title: 'Code Review',
    startTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 13, 0),
    endTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 14, 0),
    attendees: [attendees[2], attendees[3]],
    color: '#EF4444',
  },
  {
    id: '6',
    title: 'Team Lunch',
    startTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 2, 12, 0),
    endTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 2, 13, 0),
    attendees: [attendees[0], attendees[1], attendees[2], attendees[3], attendees[4]],
    color: '#EC4899',
  },
  {
    id: '7',
    title: 'Product Demo',
    startTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 2, 15, 0),
    endTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 2, 16, 30),
    attendees: [attendees[0], attendees[4], attendees[5]],
    color: '#06B6D4',
  },
  {
    id: '8',
    title: '1-on-1 with Manager',
    startTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 11, 0),
    endTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 11, 30),
    attendees: [attendees[0]],
    color: '#8B5CF6',
  },
  {
    id: '9',
    title: 'Engineering All-Hands',
    startTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 14, 0),
    endTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 15, 30),
    attendees: [attendees[0], attendees[1], attendees[2], attendees[3], attendees[4], attendees[5]],
    color: '#3B82F6',
  },
  {
    id: '10',
    title: 'Coffee Chat',
    startTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 10, 0),
    endTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 10, 30),
    attendees: [attendees[1], attendees[2]],
    color: '#F59E0B',
  },
  {
    id: '11',
    title: 'Tech Talk: React Best Practices',
    startTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 13, 0),
    endTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 14, 30),
    attendees: [attendees[0], attendees[2], attendees[3], attendees[5]],
    color: '#10B981',
  },
  // Overlapping events for deck stacking demo
  {
    id: '12',
    title: 'Workshop A',
    startTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 15, 0),
    endTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 16, 30),
    attendees: [attendees[0], attendees[1]],
    color: '#6366F1',
  },
  {
    id: '13',
    title: 'Workshop B',
    startTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 15, 30),
    endTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 17, 0),
    attendees: [attendees[2], attendees[3]],
    color: '#EC4899',
  },
];
