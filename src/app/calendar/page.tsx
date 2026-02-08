import { db } from "@/db";
import { events } from "@/db/schema";
import EventCalendar from "@/../components/EventCalendar";


export default async function CalendarPage() {
    
    const allEvents = await db.select().from(events);

    
    return (            
        
        <EventCalendar events={allEvents} />
      
    );
  
    
}