export const createGoogleCalendarLink = (event: { 
  title: string; 
  dateTime: Date; 
  location: string; 
  description: string | null 
}) => {
  const baseUrl = "https://calendar.google.com/calendar/r/eventedit";
  
  // google format: YYYYMMDDTHHmmSSZ
  const formatTime = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const startTime = new Date(event.dateTime);
  const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // + 2 sata, treba kada se zavrsava zbog google kalendara

  const params = new URLSearchParams({
    text: `Pub Quiz: ${event.title}`,
    dates: `${formatTime(startTime)}/${formatTime(endTime)}`,
    details: event.description || "Dođite na pub kviz!",
    location: event.location,
  });

  return `${baseUrl}?${params.toString()}`;
};

export type ResultWithTeam = {
  points: number;
  team: { teamName: string };
};

export function calculateScoreboard(allResults: ResultWithTeam[]) {
  const scoreMap = new Map<string, number>();

  allResults.forEach((r) => {
    const teamName = r.team.teamName;
    const current = scoreMap.get(teamName) || 0;
    scoreMap.set(teamName, current + r.points);
  });

  return Array.from(scoreMap.entries())
    .map(([team, points]) => ({ team, points }))
    .sort((a, b) => b.points - a.points);
}