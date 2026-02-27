"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Edit2, Trash2 } from "lucide-react";
import PopUpEvent from "../../../../components/PopUpEvent";

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // id: null, ako je id null onda svase zna da je post, ako ne onda je patch
  // name: "", startDate: "", endDate: "" da polja ne budu undefined na pocetku, zbog gresaka
  const [form, setForm] = useState({ id: null, name: "", startDate: "", endDate: "" });

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
      //.toISOString() pretvara datum u standradni format npr. 2024-05-20T14:30:00.000Z
      startDate: new Date(s.startDate).toISOString().split("T")[0],
      endDate: new Date(s.endDate).toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    // ako je form.id null, isUpdate ce biti false => pravi se nova sezona
    // ako form.id postoji, isUpdate ce biti true => updateuje se onda
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

  return (
    <div className="p-8 bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-tighter">Seasons</h1>
          <button 
            onClick={() => { setForm({ id: null, name: "", startDate: "", endDate: "" }); setIsModalOpen(true); }}
            className="border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-6 py-2 rounded text-xs uppercase"
          >
            Add Season
          </button>
        </div>

        <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/20">
          <table className="w-full text-left">
            <thead className="bg-neutral-900/50 text-xs border-b border-neutral-800 uppercase text-neutral-500 tracking-widest">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Start Date</th>
                <th className="p-4">End Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {seasons.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-900/40">
                  <td className="p-4 font-bold text-yellow-500">{s.name}</td>
                  <td className="p-4 text-neutral-400 text-sm">
                    {new Date(s.startDate).toLocaleDateString("sr-RS", { 
                        day: '2-digit', month: '2-digit', year: 'numeric'})}
                  </td>
                  <td className="p-4 text-neutral-400 text-sm">
                    {new Date(s.endDate).toLocaleDateString("sr-RS", { 
                        day: '2-digit', month: '2-digit', year: 'numeric'})}
                  </td>
                  <td className="p-4 flex justify-end gap-3">
                    <button onClick={() => openEdit(s)} className="text-blue-400 hover:text-blue-200"><Edit2 size={16} /></button>
                    <button onClick={() => deleteSeason(s.id)} className="text-red-500 hover:text-red-300"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link href="/admin" className="flex items-center gap-1 text-neutral-500 hover:text-yellow-500 text-xs uppercase font-bold mt-8 justify-center transition-colors">
          <ChevronLeft size={14} /> Back to Admin Panel
        </Link>
      </div>

      <PopUpEvent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={form.id ? "Edit Season" : "New Season"}>
        <form onSubmit={save} className="space-y-4 mt-4">
          <input 
            className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded text-white outline-none focus:border-yellow-500"
            placeholder="Season Name"
            value={form.name}
            // ...from uzme sve sa stare forme i prekopira ih
            // pa onda name: e.target.value menja samo naziv sezone
            onChange={e => setForm({...form, name: e.target.value})}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="date"
              className="w-full border border-neutral-800 p-3 rounded text-white outline-none focus:border-yellow-500 [color-scheme:dark]"
              min={new Date().toISOString().split("T")[0]}
              value={form.startDate}
              onChange={e => setForm({...form, startDate: e.target.value})}
              required
            />
            <input 
              type="date"
              className="w-full border border-neutral-800 p-3 rounded text-white outline-none focus:border-yellow-500 [color-scheme:dark]"
              min={new Date().toISOString().split("T")[0]}
              value={form.endDate}
              onChange={e => setForm({...form, endDate: e.target.value})}
              required
            />
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