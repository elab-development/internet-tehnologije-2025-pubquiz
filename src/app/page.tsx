import { db } from "@/db";
import { events, results, seasons } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import Scoreboard from "@/../components/Scoreboard";
import SeasonSelector from "@/../components/SeasonSelector"; 

export default async function HomePage(props: { searchParams?: Promise<{ seasonId?: string }>; }) {
  const params = await props.searchParams;
  const urlSeasonId = params?.seasonId ? parseInt(params.seasonId) : null;

  const allSeasons = await db.query.seasons.findMany({
    orderBy: [desc(seasons.startDate)],
  });

  let displaySeason = urlSeasonId ? allSeasons.find((s) => s.id === urlSeasonId) : null;
  const now = new Date();

  if (!displaySeason) {
    displaySeason = allSeasons.find(s => s.startDate <= now && s.endDate >= now) || allSeasons.find(s => s.startDate <= now) || allSeasons[0];
  }

  if (!displaySeason) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-neutral-400 p-6">
        <h1 className="text-xl font-bold">No seasons available</h1>
      </div>
    );
  }

  const seasonEvents = await db.query.events.findMany({
    where: eq(events.seasonId, displaySeason.id),
  });

  const eventIds = seasonEvents.map(e => e.id);
  let sortedScoreboard: { team: string; points: number }[] = [];

  if (eventIds.length > 0) {
    const allResults = await db.query.results.findMany({
      where: inArray(results.eventId, eventIds),
      with: { team: true }
    });

    const scoreMap = new Map<string, number>();
    allResults.forEach((r) => {
      const teamName = r.team.teamName;
      scoreMap.set(teamName, (scoreMap.get(teamName) || 0) + r.points);
    });

    sortedScoreboard = Array.from(scoreMap.entries())
      .map(([team, points]) => ({ team, points }))
      .sort((a, b) => b.points - a.points);
  }

  return (
    <main className="bg-neutral-950 text-white px-4 py-8 md:px-8 md:py-16 selection:bg-yellow-500/30">

      <div className="max-w-4xl mx-auto mb-10 md:mb-16 text-center">
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
          Pub Quiz <span className="text-yellow-500">League</span>
        </h1>
        <p className="text-neutral-500 mt-4 font-medium text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Track every point, analyze your progress with real-time stats, and rise to the top of the quiz world.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
          
          <div className="p-6 flex flex-col items-center justify-center gap-6 border-b border-neutral-800 bg-neutral-900/40 md:flex-row md:justify-between md:items-center">
     
            <div className="w-full sm:w-auto flex justify-center md:justify-start">
              <SeasonSelector 
                seasons={allSeasons} 
                currentSeasonId={displaySeason.id} 
              />
            </div>

            <div className="flex items-center justify-end py-2">
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-1">Teams: {sortedScoreboard.length}</p>
            </div>

           </div>

          <div className="overflow-x-auto scrollbar-hide">
            {sortedScoreboard.length === 0 ? (
              <div className="p-12 text-center text-neutral-500 italic text-sm">
                No results for the season <span className="text-yellow-500 font-bold">{displaySeason.name}</span>.
              </div>
            ) : (
              <div className="min-w-[300px]">
                <Scoreboard data={sortedScoreboard} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}