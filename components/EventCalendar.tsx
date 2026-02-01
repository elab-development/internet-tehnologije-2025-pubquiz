'use client';

import * as dateFns from 'date-fns';
import { useState } from 'react';



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

 
  return (
    <div className="mx-4 md:mx-8">

      {/* div za header*/}
      <div className="text-center">
        <h1 className="text-xl font-bold mb-2">
            {dateFns.format(currentDate, "MMMM y")}
        </h1>
        
        {/* div za mesece napred nazad*/}
        <div className='flex items-center justify-center gap-3'>
          <button onClick={prevMonth} className="hover:text-yellow-500">
            Previous
          </button>
          <button onClick={nextMonth} className="hover:text-yellow-500">
            Next
          </button>
        </div>
      </div>

      {/* div za nazive dana u nedelji*/}
      <div className="grid grid-cols-7 text-center font-bold">
        {dayName.map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      {/* div za dane u mesecu*/}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          
          
          const dayEvents = events.filter((e) => {
              return dateFns.isSameDay(new Date(e.dateTime), day);
          });

          return (
            <div
              key={day.toString()}
              className="min-h-24 border"
            >
              
              {/* div za dan u mesecu*/}
              <div className="font-bold text-sm text-right p-1"> 
                {dateFns.format(day, "d")}
              </div>

              {/* kvizovi tog dana */}
              <div className="flex flex-col">
                {dayEvents.map((ev) => (
                    <div key={ev.id} className="border border-yellow-500 text-xs p-1 m-1 rounded">
                   
                    <span className="font-bold">
                        {dateFns.format(new Date(ev.dateTime), "HH:mm")}
                    </span> 
                    <span> - {ev.title}</span>
                    </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
}