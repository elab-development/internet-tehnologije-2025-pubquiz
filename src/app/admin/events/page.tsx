"use client";

import { useState, useEffect } from "react";
import AdminTable from "@/../components/AdminTable";
import ShowAllButton from "@/../components/ShowAllButton";
import BtnBackToAdmin from "@/../components/BtnBackToAdmin";
import BtnSaveAndCancel from "@/../components/BtnSaveAndCancel";
import PopUpEvent from "@/../components/PopUpEvent";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({ id: null, title: "", dateTime: "", seasonId: "" });

  const LIMIT = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [evRes, seRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/seasons")
      ]);
      const evData = await evRes.json();
      const seData = await seRes.json();
      setEvents(Array.isArray(evData) ? evData : []);
      setSeasons(Array.isArray(seData) ? seData : []);
    } catch (err) {
      console.error("Greška:", err);
    }
  };

  const openCreate = () => {
    setForm({ id: null, title: "", dateTime: "", seasonId: "" });
    setIsModalOpen(true);
  };

  const openEdit = (event: any) => {
    setForm({
      id: event.id,
      title: event.title,
      dateTime: new Date(event.dateTime).toISOString().slice(0, 16),
      seasonId: event.seasonId.toString()
    });
    setIsModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = !!form.id;
    const url = isUpdate ? `/api/events/${form.id}` : "/api/events";
    const method = isUpdate ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      fetchData();
      setIsModalOpen(false);
    } else {
      const err = await res.json();
      alert(err.error || "Greška pri čuvanju");
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this quiz?")) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) setEvents(events.filter(e => e.id !== id));
  };

  const columns = [
    { 
      header: "Quiz Title", 
      key: "title", 
      render: (event: any) => {
        const isPast = new Date(event.dateTime) < new Date();
        return (
          <span className={`font-bold ${isPast ? 'text-neutral-600' : 'text-yellow-500'}`}>
            {event.title}
          </span>
        );
      }
    },
    { 
      header: "Season", 
      key: "seasonId", 
      render: (event: any) => (
        <span className="text-neutral-400 text-sm">
          {seasons.find(s => s.id === event.seasonId)?.name || "N/A"}
        </span>
      )
    },
    { 
      header: "Date & Time", 
      key: "dateTime", 
      render: (event: any) => (
        <span className="text-neutral-400 text-sm">
          {new Date(event.dateTime).toLocaleString("sr-RS", { 
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
          })}
        </span>
      )
    }
  ];

  const shouldShowButton = events.length > LIMIT;
  const displayedEvents = (shouldShowButton && !showAll) ? events.slice(0, LIMIT) : events;

  const inputClass = "w-full bg-neutral-950 border border-neutral-800 p-3 rounded text-white mb-4 outline-none focus:border-yellow-500 transition-colors";

  return (
    <div className="p-8 bg-neutral-950 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter">Quizzes</h1>
            {shouldShowButton && (
              <ShowAllButton 
                onClick={() => setShowAll(!showAll)} 
                showAll={showAll} 
                totalCount={events.length} 
              />
            )}
          </div>
          <button
            onClick={openCreate}
            className="border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-6 py-2 rounded text-xs uppercase transition-all"
          >
            Schedule New Quiz
          </button>
        </div>

        <AdminTable 
          columns={columns} 
          data={displayedEvents} 
          onEdit={openEdit} 
          onDelete={deleteEvent}
          isActionDisabled={(event) => new Date(event.dateTime) < new Date()} 
        />

        <BtnBackToAdmin />
      </div>

      <PopUpEvent 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={form.id ? "Edit Quiz" : "Schedule New Quiz"}
      >
        <form onSubmit={save} className="mt-4">
          <div className="mb-1">
            <label className="text-xs text-neutral-500 font-bold uppercase mb-1 block ml-1">Quiz Title</label>
            <input required className={inputClass} value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div className="mb-1">
            <label className="text-xs text-neutral-500 font-bold uppercase mb-1 block ml-1">Date & Time</label>
            <input type="datetime-local" required className={`${inputClass} [color-scheme:dark]`} value={form.dateTime} onChange={e => setForm({...form, dateTime: e.target.value})} />
          </div>
          <div className="mb-1">
            <label className="text-xs text-neutral-500 font-bold uppercase mb-1 block ml-1">Season</label>
            <select required className={inputClass} value={form.seasonId} onChange={e => setForm({...form, seasonId: e.target.value})}>
              <option value="" disabled hidden>Select Season...</option>
              {seasons.map(s => <option key={s.id} value={s.id} className="bg-neutral-950 text-white">{s.name}</option>)}
            </select>
          </div>
          
          <BtnSaveAndCancel 
            onCancel={() => setIsModalOpen(false)} 
            saveLabel={form.id ? "Update" : "Schedule"} 
          />
        </form>
      </PopUpEvent>
    </div>
  );
}