"use client";

import { useState, useEffect } from "react";
import { Star, Edit2 } from "lucide-react";
import PopUpEvent from "@/../components/PopUpEvent";
import ShowAllButton from "@/../components/ShowAllButton";
import TeamChart from "@/../components/TeamChart";
import BtnSaveAndCancel from "@/../components/BtnSaveAndCancel";

export default function TeamProfilePage({ params }: { params: { id: string } }) {
  const teamId = params.id;

  const [profile, setProfile] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [formData, setFormData] = useState({
    teamName: "",
    captainName: "",
    members: ""
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/teams/profile?teamId=${teamId}`);
      
      if (res.ok) {
        const data = await res.json();
        
        setProfile(data);
        setFormData({
          teamName: data.teamName || "",
          captainName: data.captainName || "",
          members: data.members || ""
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } 
  };

  useEffect(() => {
    fetchProfile();
  }, [teamId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/teams/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: teamId }),
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchProfile();
      }
    } catch (err) {
      alert("Greška pri čuvanju");
    }
  };

  
  const results = profile?.results || [];
  const chartData = [...results].reverse().map((r: any) => ({
    name: r.event?.title || "Kviz",
    points: r.points
  }));

  return (
    <div className="bg-neutral-950 text-neutral-200 p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <section className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 relative mb-8 shadow-lg">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-yellow-500" />
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic">
              {profile?.teamName || "Tim"}
            </h1>
            
            <button onClick={() => setIsEditModalOpen(true)} className="p-2 text-blue-400 hover:text-blue-200">
              <Edit2 size={22} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest block border-b border-neutral-800 pb-1 mb-2">Captain</span>
              <p className="text-lg text-white font-medium">{profile?.captainName || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest block border-b border-neutral-800 pb-1 mb-2">Team members</span>
              <p className="text-sm text-neutral-400 italic">{profile?.members || "Nisu uneti"}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-1 lg:order-2">
            <h2 className="text-[10px] font-bold text-neutral-500 uppercase mb-4 flex items-center gap-2">
              <Star size={12} className="text-yellow-500 fill-yellow-500" /> Point Trends
            </h2>
            <div className="bg-neutral-900/20 border border-neutral-800 rounded-3xl p-6 h-[400px]">
              {results.length > 0 ? (
                <TeamChart data={chartData} />
              ) : (
                <p className="text-neutral-600 text-center pt-40">No data available.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-2">
                <Star size={12} className="text-yellow-500 fill-yellow-500" /> History
              </h2>
              {results.length > 5 && (
                <ShowAllButton showAll={showAll} totalCount={results.length} onClick={() => setShowAll(!showAll)} />
              )}
            </div>
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <tbody className="divide-y divide-neutral-800/50">
                  {(showAll ? results : results.slice(0, 5)).map((res: any) => (
                    <tr key={res.id} className="hover:bg-neutral-800/20 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white text-sm">{res.event?.title}</p>
                        <p className="text-[10px] text-neutral-500 mt-1">
                          {res.event?.dateTime ? new Date(res.event.dateTime).toLocaleDateString("sr-RS") : ""}
                        </p>
                      </td>
                      <td className="p-4 text-right font-black text-yellow-500 text-xl tracking-tighter">{res.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <PopUpEvent isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Izmena profila">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Naziv tima</label>
            <input 
              className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-white outline-none focus:border-yellow-500" 
              value={formData.teamName} 
              onChange={(e) => setFormData({...formData, teamName: e.target.value})} 
              required 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Captain</label>
            <input 
              className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-white outline-none focus:border-yellow-500" 
              value={formData.captainName} 
              onChange={(e) => setFormData({...formData, captainName: e.target.value})} 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Članovi</label>
            <textarea 
              className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-white outline-none focus:border-yellow-500" 
              rows={3} 
              value={formData.members} 
              onChange={(e) => setFormData({...formData, members: e.target.value})} 
            />
          </div>
          <BtnSaveAndCancel onCancel={() => setIsEditModalOpen(false)} />
        </form>
      </PopUpEvent>
    </div>
  );
}