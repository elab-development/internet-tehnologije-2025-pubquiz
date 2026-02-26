"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import PopUpEvent from "@/../components/PopUpEvent";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({ id: null, title: "", dateTime: "", seasonId: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // pokrece oba zahteva istovremeno Promise.all
      // vraca se niz odgovora  [evRes, seRes] kada se obe zavrse, u suprotnom ide u catch 
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
      // .slice(0, 16) da uzme samo ceo datum, a za vreme samo sat i minute
      dateTime: new Date(event.dateTime).toISOString().slice(0, 16),
      // pretvara u string zbog <select> kasnije
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
    // events.filter(e => e.id !== id) sacuvaj sve kvizove koji nemaju ovaj id
    if (res.ok) setEvents(events.filter(e => e.id !== id));
  };

  const inputClass = "w-full bg-neutral-950 border border-neutral-800 p-3 rounded text-white mb-4 outline-none focus:border-yellow-500";

  return (
    <div className="p-8 bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tighter">QUIZZES</h1>
          <button
            onClick={openCreate}
            className="bg-neutral-950 text-yellow-500 border border-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-6 py-2 rounded-md transition-colors text-sm"
          >
            Schedule New Quiz
          </button>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-900/30 text-xs border-b border-neutral-800 uppercase text-neutral-500 font-bold tracking-widest">
              <tr>
                <th className="p-4">Quiz Title</th>
                <th className="p-4">Season</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {(showAll ? events : events.slice(0, 5)).map((event) => {
                const isPast = new Date(event.dateTime) < new Date();
                return (
                  <tr key={event.id} className={`transition-colors ${isPast ? 'opacity-40 grayscale' : 'hover:bg-neutral-900/20'}`}>
                    <td className="p-4 font-bold text-yellow-500">{event.title}</td>
                    <td className="p-4 text-neutral-400 text-sm">
                      {seasons.find(s => s.id === event.seasonId)?.name || "N/A"}
                    </td>
                    <td className="p-4 text-neutral-400 text-sm">
                      {new Date(event.dateTime).toLocaleString("sr-RS", { 
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-3">
                      {!isPast ? (
                        <>
                          <button onClick={() => openEdit(event)} className="text-blue-400 hover:text-blue-200">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-300">
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs border border-neutral-800 px-2 py-0.5 rounded text-neutral-600 uppercase font-bold">Finished</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {events.length > 5 && (
            <button 
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="w-full py-4 bg-neutral-900/40 hover:bg-neutral-800 border-t border-neutral-800 text-xs font-black text-neutral-500 hover:text-yellow-500 transition-all flex items-center justify-center gap-2 uppercase tracking-wide group"
            >
              {showAll ? (
                <>Show Less <ChevronUp size={14} /></>
              ) : (
                <>Show All ({events.length}) <ChevronDown size={14} /></>
              )}
            </button>
          )}

          {events.length === 0 && <div className="p-10 text-center text-neutral-600 italic text-sm">No events found.</div>}
        </div>

        <div className="flex justify-center items-center">
          <Link href="/admin" className="flex items-center gap-1 text-neutral-500 hover:text-yellow-500 text-xs uppercase font-bold mt-8 justify-center transition-colors">
          <ChevronLeft size={14} /> Back to Admin Panel
        </Link>
        </div>
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
            <input type="datetime-local" required className={`${inputClass} [color-scheme:dark]`} min={new Date().toISOString().slice(0, 16)} value={form.dateTime} onChange={e => setForm({...form, dateTime: e.target.value})} />
          </div>
          <div className="mb-1">
            <label className="text-xs text-neutral-500 font-bold uppercase mb-1 block ml-1">Season</label>
            <select required className={inputClass} value={form.seasonId} onChange={e => setForm({...form, seasonId: e.target.value})}>
              <option value="" disabled hidden>Select Season...</option>
              {seasons.map(s => <option key={s.id} value={s.id} className="bg-neutral-950 text-white">{s.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-neutral-800 text-white font-bold py-3 rounded uppercase text-xs hover:bg-neutral-700">Cancel</button>
            <button type="submit" className="flex-1 bg-yellow-500 text-black font-bold py-3 rounded uppercase text-xs hover:bg-yellow-400">Save</button>
          </div>
        </form>
      </PopUpEvent>
    </div>
  );
}