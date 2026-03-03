import { db } from "@/db";
import { events, results, seasons } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import Scoreboard from "@/../components/Scoreboard";
import SeasonSelector from "@/../components/SeasonSelector"; 

import TriviaCard from "../../components/TriviaCard";
import { calculateScoreboard } from "@/lib/utils";

export default async function HomePage(props: {  searchParams?: Promise<{ seasonId?: string }>;}) {

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

    sortedScoreboard = calculateScoreboard(allResults);
  }

  
  return (
    <main className="bg-neutral-950 text-white px-4 py-8 md:px-8 md:py-16 selection:bg-yellow-500/30">

      <div className="max-w-2xl mx-auto">
        <h1 className="text-center text-6xl font-black italic tracking-wider text-white uppercase mb-4">
          <span className="text-yellow-500">PubQuiz</span> League
        </h1>
        <div className="bg-neutral-950/30 border border-neutral-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
          
          <div className="flex flex-col flex-start gap-2 border-b border-neutral-800 md:flex-row md:justify-between md:items-center">
            
            <div className="w-full mx-6 my-2 sm:w-auto flex justify-start md:justify-start">
              <SeasonSelector 
                seasons={allSeasons} 
                currentSeasonId={displaySeason.id} 
              />
            </div>

            <div className="flex items-center justify-start mx-6 my-2">
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

        <div className="max-w-2xl mx-auto mt-8">
          <TriviaCard />
        </div>
       </div>

    </main>
  );
}