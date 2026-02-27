"use client";
import { useState, useEffect } from "react";
import { Star, Edit2 } from "lucide-react";
import PopUpEvent from "@/../components/PopUpEvent";
import ShowAllButton from "@/../components/ShowAllButton";
import TeamChart from "@/../components/TeamChart"

export default function MyProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({ teamName: "", captainName: "", members: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/teams/profile");
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
      console.error("Fetch error: ", err);
    }

  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/teams/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchProfile();
      }
    } catch (err) {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const allResults = profile?.results || [];
  const chartData = allResults.map((res: any) => ({
    name: res.event.title,
    points: res.points
  }));
  const displayResults = showAll ? allResults : allResults.slice(0, 5);

  return (
    <div className="bg-neutral-950 text-neutral-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        <section className="bg-neutral-950/30 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-yellow-500" />

          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">
                {profile?.teamName}
              </h1>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-blue-400 hover:text-blue-200"
            >
              <Edit2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest block border-b border-neutral-800 pb-1 mb-2">
                Captain Name
              </span>
              <p className="text-lg text-white font-medium">{profile?.captainName || "NA"}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest block border-b border-neutral-800 pb-1 mb-2">
                Team members
              </span>
              <p className="text-sm text-neutral-400 italic leading-relaxed">
                {profile?.members || "Not set"}
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-3">
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <Star size={12} className="text-yellow-500" /> Statistics
              </h2>
            </div>

            {allResults.length > 0 && <TeamChart data={chartData} />}

            <div className="flex justify-between items-center px-2 mt-6">
              <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <Star size={12} className="text-yellow-500" /> History
              </h2>
              {allResults.length > 5 && (
                <ShowAllButton
                  showAll={showAll}
                  totalCount={allResults.length}
                  onClick={() => setShowAll(!showAll)}
                />
              )}
            </div>
          </div>
          

          <div className="bg-neutral-950/30 border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <tbody className="divide-y divide-neutral-800/50">
                {displayResults.map((res: any) => (
                  <tr key={res.id} className="hover:bg-neutral-500/20 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-white text-sm group-hover:text-yellow-500 transition-colors">
                        {res.event.title}
                      </p>
                      <p className="text-[10px] text-neutral-500 uppercase mt-0.5">
                        {new Date(res.event.dateTime).toLocaleDateString("sr-RS")}
                      </p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-right pr-5 text-xl font-black text-yellow-500 tracking-tighter">
                        {res.points}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {allResults.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-neutral-600 italic text-sm">No data available for this team.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <PopUpEvent
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Team Profile"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Team Name</label>
            <input
              className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl focus:border-yellow-500 outline-none text-sm text-white transition-all"
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Captain Name</label>
            <input
              className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl focus:border-yellow-500 outline-none text-sm text-white transition-all"
              value={formData.captainName}
              onChange={(e) => setFormData({ ...formData, captainName: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Team Members</label>
            <textarea
              className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl focus:border-yellow-500 outline-none text-sm text-white resize-none transition-all"
              rows={3}
              placeholder="Separate names with commas..."
              value={formData.members}
              onChange={(e) => setFormData({ ...formData, members: e.target.value })}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-neutral-800 text-white font-bold py-3 rounded uppercase text-xs hover:bg-neutral-700">Cancel</button>
            <button type="submit" className="flex-1 bg-yellow-500 text-black font-bold py-3 rounded uppercase text-xs hover:bg-yellow-400">Save</button>
          </div>
        </form>
      </PopUpEvent>
    </div>
  );
}