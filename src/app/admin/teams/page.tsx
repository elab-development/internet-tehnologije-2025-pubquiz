"use client";

import { useState, useEffect } from "react";
import AdminTable from "@/../components/AdminTable";
import ShowAllButton from "@/../components/ShowAllButton";
import BtnBackToAdmin from "@/../components/BtnBackToAdmin";
import BtnSaveAndCancel from "@/../components/BtnSaveAndCancel";
import PopUpEvent from "@/../components/PopUpEvent";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({ id: null, teamName: "", captainName: "" });

  const LIMIT = 8;

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

  const columns = [
    { 
      header: "Team Name", 
      key: "teamName", 
      render: (team: any) => (
        <span className="font-bold text-yellow-500 uppercase tracking-tight">
          {team.teamName}
        </span>
      )
    },
    { 
      header: "Team Leader", 
      key: "captainName",
      render: (team: any) => (
        <span className="text-neutral-400 text-sm">
          {team.captainName || "Not set"}
        </span>
      )
    }
  ];

  const shouldShowButton = teams.length > LIMIT;
  const displayedTeams = (shouldShowButton && !showAll) ? teams.slice(0, LIMIT) : teams;

  const inputClass = "w-full bg-neutral-950 border border-neutral-800 p-3 rounded text-white mb-4 outline-none focus:border-yellow-500 transition-colors";

  return (
    <div className="p-8 bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter">Team Management</h1>
            {shouldShowButton && (
              <ShowAllButton 
                onClick={() => setShowAll(!showAll)} 
                showAll={showAll} 
                totalCount={teams.length} 
              />
            )}
          </div>
          <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest pb-1">
            Total Teams: {teams.length}
          </div>
        </div>

        <AdminTable 
          columns={columns} 
          data={displayedTeams} 
          onEdit={openEdit} 
          onDelete={deleteTeam} 
        />

        <BtnBackToAdmin />
      </div>

      <PopUpEvent 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Edit Team Details"
      >
        <form onSubmit={save} className="mt-4">
          <div className="mb-2">
            <label className="text-xs text-neutral-500 font-bold uppercase mb-1 block ml-1">Team Name</label>
            <input 
              required className={inputClass} 
              value={form.teamName} 
              onChange={e => setForm({...form, teamName: e.target.value})} 
            />
          </div>

          <div className="mb-2">
            <label className="text-xs text-neutral-500 font-bold uppercase mb-1 block ml-1">Team Leader</label>
            <input 
              className={inputClass} 
              value={form.captainName} 
              onChange={e => setForm({...form, captainName: e.target.value})} 
            />
          </div>

          <BtnSaveAndCancel 
            onCancel={() => setIsModalOpen(false)} 
            saveLabel="Update Team" 
          />
        </form>
      </PopUpEvent>
    </div>
  );
}