"use client";

import { useRouter} from "next/navigation";

type Season = {
  id: number;
  name: string;
};

export default function SeasonSelector({ seasons, currentSeasonId }: { seasons: Season[], currentSeasonId: number }) {

  const router = useRouter();

  const handleChange = (e: any) => {
    const newSeasonId = e.target.value;  
    router.push(`/?seasonId=${newSeasonId}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-400">Season:</span>
      
      <select
        value={currentSeasonId}
        onChange={handleChange}
        className="bg-neutral-800 text-yellow-500 hover:text-yellow-400 text-sm font-medium border border-neutral-700 rounded px-2 py-1"
      >
        {seasons.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}