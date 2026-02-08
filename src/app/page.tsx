import { db } from "@/db";
import { events, results, seasons } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import Scoreboard from "@/../components/Scoreboard";
import SeasonSelector from "@/../components/SeasonSelector"; 



export default async function HomePage(props: {  searchParams?: Promise<{ seasonId?: string }>;}) {
  
  const params = await props.searchParams;
  const urlSeasonId = params?.seasonId ? parseInt(params.seasonId) : null;

  
  const allSeasons = await db.query.seasons.findMany({
    orderBy: [desc(seasons.startDate)],
  });

  
  let displaySeason;
  const now = new Date();

  if (urlSeasonId) {    
    displaySeason = allSeasons.find((s) => s.id === urlSeasonId);
  } 
  
  if (!displaySeason) {
    displaySeason = allSeasons.find(s => s.startDate <= now && s.endDate >= now);
  }

  if (!displaySeason) {//najnovija prosla
    displaySeason = allSeasons.find(s => s.startDate <= now);
  }

  
  if (!displaySeason) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-neutral-950 text-neutral-400">
        <h1 className="text-2xl font-bold">No seasons available</h1>
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
      const current = scoreMap.get(teamName) || 0;
      scoreMap.set(teamName, current + r.points);
    });

    sortedScoreboard = Array.from(scoreMap.entries())
      .map(([team, points]) => ({ team, points }))
      .sort((a, b) => b.points - a.points);
  }

  return (
    <main className="text-white p-6 md:p-12">
      
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-500">
          Pub Quiz League
        </h1>
      </div>

      <div className="max-w-2xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        
        <div className="p-6 flex justify-between items-center bg-neutral-800/50">
          <div>
            <SeasonSelector 
              seasons={allSeasons} 
              currentSeasonId={displaySeason.id} 
            />
          </div>

          <div className="bg-neutral-950 px-3 py-1 rounded-full text-xs text-neutral-400 border border-neutral-800">
            {sortedScoreboard.length} TEAMS
          </div>
        </div>

        
        {sortedScoreboard.length === 0 ? (
          <div className="p-10 text-center text-neutral-400">
            No results for the season <span className="text-yellow-500 font-bold">{displaySeason.name}</span>.
          </div>
        ) : (
          <Scoreboard data={sortedScoreboard} />
        )}
      </div>

    </main>
  );
}