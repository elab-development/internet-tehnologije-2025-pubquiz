"use client";

import { useState, useEffect } from "react";
import AdminTable from "@/../components/AdminTable";
import ShowAllButton from "@/../components/ShowAllButton";
import BtnBackToAdmin from "@/../components/BtnBackToAdmin";
import BtnSaveAndCancel from "@/../components/BtnSaveAndCancel";
import PopUpEvent from "@/../components/PopUpEvent";

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({ id: null, eventId: "", teamId: "", points: "" });

  const LIMIT = 8;

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

  const columns = [
    { 
      header: "Quiz / Event", 
      key: "eventId", 
      render: (res: any) => (
        <span className="font-bold text-neutral-300">
          {res.event?.title || "Unknown Quiz"}
        </span>
      )
    },
    { 
      header: "Team", 
      key: "teamId", 
      render: (res: any) => (
        <span className="font-bold text-yellow-500 uppercase tracking-tight text-sm">
          {res.team?.teamName || "Unknown Team"}
        </span>
      )
    },
    { 
      header: "Points", 
      key: "points",
      render: (res: any) => (
        <div className="text-center">
          <span className="font-black text-xl text-neutral-100 bg-neutral-800 px-3 py-1 rounded">
            {res.points}
          </span>
        </div>
      )
    }
  ];

  const shouldShowButton = results.length > LIMIT;
  const displayedResults = (shouldShowButton && !showAll) ? results.slice(0, LIMIT) : results;

  const inputClass = "w-full bg-neutral-950 border border-neutral-800 p-3 rounded text-white mb-4 outline-none focus:border-yellow-500 transition-colors";

  return (
    <div className="p-8 bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto">
  
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter">Results</h1>
            {shouldShowButton && (
              <ShowAllButton 
                onClick={() => setShowAll(!showAll)} 
                showAll={showAll} 
                totalCount={results.length} 
              />
            )}
          </div>
          <button
            onClick={openCreate}
            className="border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-6 py-2 rounded text-xs uppercase transition-all"
          >
            Add New Score
          </button>
        </div>

        <AdminTable 
          columns={columns} 
          data={displayedResults} 
          onEdit={openEdit} 
          onDelete={deleteResult} 
          isActionDisabled={(res) => {
            const eventDate = new Date(res.event?.dateTime);
            const sevenDaysAfterEvent = new Date(eventDate);
            sevenDaysAfterEvent.setDate(sevenDaysAfterEvent.getDate() + 7);
            return new Date() > sevenDaysAfterEvent;
          }}  
        />

        <BtnBackToAdmin />
      </div>

      <PopUpEvent 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={form.id ? "Edit Score" : "Add Team Score"}
      >
        <form onSubmit={save} className="mt-4">
          <div className="mb-1">
            <label className="text-[10px] text-neutral-500 font-bold uppercase mb-1 block ml-1">Select Quiz</label>
            <select required className={inputClass} value={form.eventId} onChange={e => setForm({...form, eventId: e.target.value})}>
              <option value="" disabled hidden>Choose a Quiz...</option>
              {events.map(e => <option key={e.id} value={e.id} className="bg-neutral-950">{e.title}</option>)}
            </select>
          </div>

          <div className="mb-1">
            <label className="text-[10px] text-neutral-500 font-bold uppercase mb-1 block ml-1">Select Team</label>
            <select required className={inputClass} value={form.teamId} onChange={e => setForm({...form, teamId: e.target.value})}>
              <option value="" disabled hidden>Choose a Team...</option>
              {teams.map(t => <option key={t.id} value={t.id} className="bg-neutral-950">{t.teamName}</option>)}
            </select>
          </div>

          <div className="mb-1">
            <label className="text-[10px] text-neutral-500 font-bold uppercase mb-1 block ml-1">Points Scored</label>
            <input 
              type="number" required 
              placeholder="e.g. 42"
              className={inputClass} 
              value={form.points} 
              onChange={e => setForm({...form, points: e.target.value})} 
            />
          </div>

          <BtnSaveAndCancel 
            onCancel={() => setIsModalOpen(false)} 
            saveLabel={form.id ? "Update Score" : "Save Result"} 
          />
        </form>
      </PopUpEvent>
    </div>
  );
}