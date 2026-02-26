"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import PopUpEvent from "@/../components/PopUpEvent";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({ id: null, teamName: "", captainName: "" });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const openEdit = (team: any) => {
    setForm({
      id: team.id,
      teamName: team.teamName,
      captainName: team.captainName || ""
    });
    setIsModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) return;

    const res = await fetch(`/api/teams/${form.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      fetchTeams();
      setIsModalOpen(false);
    } else {
      const err = await res.json();
      alert(err.error || "Failed to save changes");
    }
  };

  const deleteTeam = async (id: string) => {
    if (!confirm("This action cannot be undone. Delete team?")) return;
    const res = await fetch(`/api/teams/${id}`, { method: "DELETE" });
    if (res.ok) setTeams(teams.filter(t => t.id !== id));
  };

  const inputClass = "w-full bg-neutral-950 border border-neutral-800 p-3 rounded text-white mb-4 outline-none focus:border-yellow-500 transition-colors";

  return (
    <div className="p-8 bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold tracking-tighter uppercase">Team Management</h1>
          <div className="text-xs text-neutral-600 font-bold lowercase tracking-wide">
            Total Teams: {teams.length}
          </div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-900/30 text-xs border-b border-neutral-800 uppercase text-neutral-500 font-bold tracking-widest">
              <tr>
                <th className="p-4">Team Name</th>
                <th className="p-4">Team Leader</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {(showAll ? teams : teams.slice(0, 5)).map((team) => (
                <tr key={team.id} className="hover:bg-neutral-900/20 transition-colors group">
                  <td className="p-4 font-bold text-yellow-500 uppercase tracking-tight">
                    {team.teamName}
                  </td>
                  <td className="p-4 text-neutral-400 text-sm">
                    {team.captainName || "Not set"}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-4">
                    <button onClick={() => openEdit(team)} className="text-blue-400 hover:text-blue-300">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteTeam(team.id)} className="text-red-500 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {teams.length > 5 && (
            <button 
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="w-full py-4 bg-neutral-900/40 hover:bg-neutral-800 border-t border-neutral-800 text-xs font-black text-neutral-500 hover:text-yellow-500 transition-all flex items-center justify-center gap-2 uppercase tracking-wide group"
            >
              {showAll ? (
                <>Show Less <ChevronUp size={14} /></>
              ) : (
                <>Show All ({teams.length}) <ChevronDown size={14} /></>
              )}
            </button>
          )}

          {teams.length === 0 && <div className="p-10 text-center text-neutral-600 italic text-sm">No teams registered.</div>}
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
        title="Edit Team Details"
      >
        <form onSubmit={save} className="mt-4">
          <div className="mb-2">
            <label className="text-xs text-neutral-500 font-bold uppercase mb-1 block ml-1">Update Team Name</label>
            <input 
              required className={inputClass} 
              value={form.teamName} 
              onChange={e => setForm({...form, teamName: e.target.value})} 
            />
          </div>

          <div className="mb-2">
            <label className="text-sm text-neutral-500 font-bold uppercase mb-1 block ml-1">Update Team Leader</label>
            <input 
              className={inputClass} 
              value={form.captainName} 
              onChange={e => setForm({...form, captainName: e.target.value})} 
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-neutral-800 text-white font-bold py-3 rounded uppercase text-xs hover:bg-neutral-700 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-yellow-500 text-black font-bold py-3 rounded uppercase text-xs hover:bg-yellow-400 transition-colors">Update Team</button>
          </div>
        </form>
      </PopUpEvent>
    </div>
  );
}