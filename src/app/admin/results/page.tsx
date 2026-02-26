"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import PopUpEvent from "@/../components/PopUpEvent";

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({ id: null, eventId: "", teamId: "", points: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resData, evData, teaData] = await Promise.all([
        fetch("/api/results").then(r => r.json()),
        fetch("/api/events").then(r => r.json()),
        fetch("/api/teams").then(r => r.json())
      ]);
      setResults(Array.isArray(resData) ? resData : []);
      setEvents(Array.isArray(evData) ? evData : []);
      setTeams(Array.isArray(teaData) ? teaData : []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const openCreate = () => {
    setForm({ id: null, eventId: "", teamId: "", points: "" });
    setIsModalOpen(true);
  };

  const openEdit = (res: any) => {
    setForm({
      id: res.id,
      eventId: res.eventId, 
      teamId: res.teamId,
      points: res.points.toString()
    });
    setIsModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = !!form.id;
    const url = isUpdate ? `/api/results/${form.id}` : "/api/results";
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
      alert("Submission failed");
    }
  };

  const deleteResult = async (id: string) => {
    if (!confirm("Permanently delete this result?")) return;
    const res = await fetch(`/api/results/${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
  };

  const inputClass = "w-full bg-neutral-950 border border-neutral-800 p-3 rounded text-white mb-4 outline-none focus:border-yellow-500 transition-colors";

  return (
    <div className="p-8 bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tighter uppercase">Results</h1>
          <button
            onClick={openCreate}
            className="bg-transparent text-yellow-500 border border-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-6 py-2 rounded-md transition-all text-sm"
          >
            + Add New Score
          </button>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-900/30 text-xs border-b border-neutral-800 uppercase text-neutral-500 font-bold tracking-widest">
              <tr>
                <th className="p-4">Quiz / Event</th>
                <th className="p-4">Team</th>
                <th className="p-4 text-center">Points</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {(showAll ? results : results.slice(0, 5)).map((res) => (
                <tr key={res.id} className="hover:bg-neutral-900/20 transition-colors">
                  <td className="p-4 font-bold text-neutral-300">
                    {res.event?.title || "Unknown Quiz"}
                  </td>
                  <td className="p-4 text-yellow-500 font-bold uppercase tracking-tight">
                    {res.team?.teamName || "Unknown Team"}
                  </td>
                  <td className="p-4 text-center font-bold text-xl text-neutral-200">
                    {res.points}
                  </td>
                  <td className="p-4 text-right flex justify-end  gap-3">
                    <button onClick={() => openEdit(res)} className="text-blue-400 hover:text-blue-200">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteResult(res.id)} className="text-red-500 hover:text-red-300">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {results.length > 5 && (
            <button 
              type="button"
              onClick={() => setShowAll(!showAll)}
             className="w-full py-4 bg-neutral-900/40 hover:bg-neutral-800 border-t border-neutral-800 text-xs font-black text-neutral-500 hover:text-yellow-500 transition-all flex items-center justify-center gap-2 uppercase tracking-wide group"
            >
              {showAll ? (
                <>Show Less <ChevronUp size={14} /></>
              ) : (
                <>Show All Results ({results.length}) <ChevronDown size={14} /></>
              )}
            </button>
          )}
          
          {results.length === 0 && <div className="p-10 text-center text-neutral-600 italic text-sm">No results entered yet.</div>}
        </div>

        <div className="flex justify-center items-center mt-2">
          <Link href="/admin" className="flex items-center gap-1 text-neutral-500 hover:text-yellow-500 text-xs uppercase font-bold mt-8 justify-center transition-colors">
          <ChevronLeft size={14} /> Back to Admin Panel
        </Link>
        </div>
      </div>

      <PopUpEvent 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={form.id ? "Edit Score" : "Add Team Score"}
      >
        <form onSubmit={save} className="mt-4">
          <div className="mb-1">
            <label className="text-xs text-neutral-500 font-bold uppercase mb-1 block ml-1">Select Quiz</label>
            <select required className={inputClass} value={form.eventId} onChange={e => setForm({...form, eventId: e.target.value})}>
              <option value="" disabled hidden>Choose a Quiz...</option>
              {events.map(e => <option key={e.id} value={e.id} className="bg-neutral-950">{e.title}</option>)}
            </select>
          </div>

          <div className="mb-1">
            <label className="text-xs text-neutral-500 font-bold uppercase mb-1 block ml-1">Select Team</label>
            <select required className={inputClass} value={form.teamId} onChange={e => setForm({...form, teamId: e.target.value})}>
              <option value="" disabled hidden>Choose a Team...</option>
              {teams.map(t => <option key={t.id} value={t.id} className="bg-neutral-950">{t.teamName}</option>)}
            </select>
          </div>

          <div className="mb-1">
            <label className="text-xs text-neutral-500 font-bold uppercase mb-1 block ml-1">Points Scored</label>
            <input 
              type="number" required 
              placeholder="e.g. 42"
              className={inputClass} 
              value={form.points} 
              onChange={e => setForm({...form, points: e.target.value})} 
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-neutral-800 text-white font-bold py-3 rounded uppercase text-xs hover:bg-neutral-700">Cancel</button>
            <button type="submit" className="flex-1 bg-yellow-500 text-black font-bold py-3 rounded uppercase text-xs hover:bg-yellow-400">Save Result</button>
          </div>
        </form>
      </PopUpEvent>
    </div>
  );
}