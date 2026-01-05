import { useState } from 'react'
import { WeekView } from './components/WeekView'
import { mockEvents } from './data/mockEvents'
import type { CalendarEvent } from './types/calendar'
import './App.css'

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);

  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  return (
    <WeekView events={events} onUpdateEvent={handleUpdateEvent} />
  )
}

export default App
