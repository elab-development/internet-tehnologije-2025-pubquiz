'use client';

import * as dateFns from 'date-fns';
import { useState } from 'react';
import PopUpEvent from "./PopUpEvent";



type Event = {
  id: number;
  seasonId: number;
  title: string;
  dateTime: Date;
  location: string;
  description: string | null; 
};

type Props = {
  events: Event[];
};



export default function EventCalendar({events}:Props){
  

  
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = dateFns.startOfMonth(currentDate);
  const monthEnd = dateFns.endOfMonth(currentDate);


  const startDate = dateFns.startOfWeek(monthStart, {weekStartsOn: 1});
  const endDate = dateFns.endOfWeek(monthEnd, {weekStartsOn: 1});
  const days = dateFns.eachDayOfInterval({start: startDate, end: endDate});

  const dayName = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  
  const nextMonth = () => setCurrentDate(dateFns.addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(dateFns.subMonths(currentDate, 1));

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
 
  return (
    <div className="mx-4 md:mx-8">

      {/* div za header*/}
      <div className="text-center mt-10">
        <h1 className="text-xl font-bold mb-2">
            {dateFns.format(currentDate, "MMMM y")}
        </h1>
        
        {/* div za mesece napred nazad*/}
        <div className='flex items-center justify-center gap-3 mb-2'>
          <button onClick={prevMonth} className="hover:text-yellow-500">Previous</button>
          <button onClick={nextMonth} className="hover:text-yellow-500">Next</button>
        </div>
      </div>

      {/* div za nazive dana u nedelji*/}
      <div className="grid grid-cols-7 text-center font-bold">
        {dayName.map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      {/* div za dane u mesecu*/}
      <div className="grid grid-cols-7 bg-neutral-900/30">
        {days.map((day) => {
          
          
          const dayEvents = events.filter((e) => {
              return dateFns.isSameDay(new Date(e.dateTime), day);
          });

          return (
            <div key={day.toString()} className="min-h-24 border border-neutral-700 rounded">
              
              {/* div za dan u mesecu*/}
              <div className="font-bold text-sm text-right p-1"> 
                {dateFns.format(day, "d")}
              </div>

              {/* kvizovi tog dana */}
              <div className="flex flex-col">
                {dayEvents.map((ev) => (
                    <div key={ev.id} onClick={() => setSelectedEvent(ev)} className="border border-yellow-500 text-xs p-1 m-1 rounded">
                   
                    <span className="font-bold">
                        {dateFns.format(ev.dateTime, "HH:mm")}
                    </span> 
                    <span> - {ev.title}</span>
                    </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      < PopUpEvent 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        title="Info"
      >
        {selectedEvent && (
          <div className="space-y-2">
            <div>
              <label className="text-neutral-500 text-sm block">Quiz Title</label>
              <p className="text-lg font-semibold">{selectedEvent.title}</p>
            </div>
            
            
              <div>
                <label className="text-neutral-500 text-sm block">Time</label>
                <p>{dateFns.format(selectedEvent.dateTime, "HH:mm")}h</p>
              </div>
              <div>
                <label className="text-neutral-500 text-sm block">Date</label>
                <p>{dateFns.format(selectedEvent.dateTime, "dd.MM.yyyy.")}</p>
              </div>
            

            <div>
              <label className="text-neutral-500 text-sm block">Location</label>
              <p className="text-neutral-300">{selectedEvent.location}</p>
            </div>

            {selectedEvent.description && (
              <div>
                <label className="text-neutral-500 text-sm block">Description</label>
                <p className="text-neutral-300">{selectedEvent.description}</p>
              </div>
            )}
          </div>
        )}
      </PopUpEvent>

    </div>
  );
  
}