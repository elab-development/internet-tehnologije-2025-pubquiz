"use client";

import { useState, useEffect } from "react";
import AdminTable from "@/../components/AdminTable";
import ShowAllButton from "@/../components/ShowAllButton";
import BtnBackToAdmin from "@/../components/BtnBackToAdmin";
import BtnSaveAndCancel from "@/../components/BtnSaveAndCancel";
import PopUpEvent from "@/../components/PopUpEvent";

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", startDate: "", endDate: "" });

  const LIMIT = 5;

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      const res = await fetch("/api/seasons");
      if (res.ok) {
        const data = await res.json();
        setSeasons(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch seasons", err);
    }
  };

  const openEdit = (s: any) => {
    setForm({
      id: s.id,
      name: s.name,
      startDate: new Date(s.startDate).toISOString().split("T")[0],
      endDate: new Date(s.endDate).toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = !!form.id;
    const url = isUpdate ? `/api/seasons/${form.id}` : "/api/seasons";
    
    const res = await fetch(url, {
      method: isUpdate ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(form),
    });

    if (res.ok) {
      fetchSeasons(); 
      setIsModalOpen(false);
    }
  };

  const deleteSeason = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/seasons/${id}`, { method: "DELETE" });
    if (res.ok) fetchSeasons();
  };

  const columns = [
    { 
      header: "Name", 
      key: "name", 
      render: (s: any) => {
        const isPast = new Date(s.endDate) < new Date();
        return <span className={`font-bold ${isPast ? 'text-neutral-600' : 'text-yellow-500'}`}>{s.name}</span>;
      }
    },
    { 
      header: "Start Date", 
      key: "startDate", 
      render: (s: any) => <span className="text-neutral-400 text-sm">{new Date(s.startDate).toLocaleDateString("sr-RS", { 
            day: '2-digit', month: '2-digit', year: 'numeric'})}</span> 
    },
    { 
      header: "End Date", 
      key: "endDate", 
      render: (s: any) => <span className="text-neutral-400 text-sm">{new Date(s.endDate).toLocaleDateString("sr-RS", { 
            day: '2-digit', month: '2-digit', year: 'numeric'})}</span> 
    },
  ];

  const shouldShowButton = seasons.length > LIMIT;
  const displayedSeasons = (shouldShowButton && !showAll) ? seasons.slice(0, LIMIT) : seasons;

  return (
    <div className="p-8 bg-neutral-950 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter">Seasons</h1>
            {shouldShowButton && (
              <ShowAllButton 
                onClick={() => setShowAll(!showAll)} 
                showAll={showAll} 
                totalCount={seasons.length} 
              />
            )}
          </div>
          <button 
            onClick={() => { setForm({ id: null, name: "", startDate: "", endDate: "" }); setIsModalOpen(true); }}
            className="border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-6 py-2 rounded text-xs uppercase transition-all"
          >
            Add Season
          </button>
        </div>

        <AdminTable 
          columns={columns} 
          data={displayedSeasons} 
          onEdit={openEdit} 
          onDelete={deleteSeason}
          isActionDisabled={(s) => new Date(s.endDate) < new Date()} 
        />

        <BtnBackToAdmin />
      </div>

      <PopUpEvent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={form.id ? "Edit Season" : "New Season"}>
        <form onSubmit={save} className="space-y-4 mt-4">
          <input 
            className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded text-white outline-none focus:border-yellow-500"
            placeholder="Season Name"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="date"
              className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded text-white outline-none focus:border-yellow-500 [color-scheme:dark]"
              value={form.startDate}
              onChange={e => setForm({...form, startDate: e.target.value})}
              required
            />
            <input 
              type="date"
              className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded text-white outline-none focus:border-yellow-500 [color-scheme:dark]"
              value={form.endDate}
              onChange={e => setForm({...form, endDate: e.target.value})}
              required
            />
          </div>
          <BtnSaveAndCancel 
            onCancel={() => setIsModalOpen(false)} 
            saveLabel={form.id ? "Update" : "Save"} 
          />
        </form>
      </PopUpEvent>
    </div>
  );
}