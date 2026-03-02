import { describe, it, expect } from 'vitest';
import { calculateScoreboard, ResultWithTeam, createGoogleCalendarLink } from '../src/lib/utils';

describe('Scoreboard logic', () => {
  it('treba ispravno da sabere poene istog tima iz vise kvizova', () => {
    const mockResults: ResultWithTeam[] = [
      { team: { teamName: 'Tim A' }, points: 10 },
      { team: { teamName: 'Tim B' }, points: 20 },
      { team: { teamName: 'Tim A' }, points: 15 }, 
    ];

    const finalScore = calculateScoreboard(mockResults);

    // Proveravamo da li je Tim A dobio ukupno 25 poena (10 + 15)
    const timA = finalScore.find(s => s.team === 'Tim A');
    expect(timA?.points).toBe(25);
    
    // Proveravamo da li je Tim A prvi na listi jer ima 25, a Tim B 20
    expect(finalScore[0].team).toBe('Tim A');
  });
});

describe('Google Calendar Link Generator', () => {
  it('treba da generise ispravan Google Calendar URL', () => {
    const mockEvent = {
      title: "test quiz",
      dateTime: new Date("2026-05-20T20:00:00Z"),
      location: "Pivnica 011",
      description: "Test opis"
    };

    const link = createGoogleCalendarLink(mockEvent);

    // Proveravamo kljucne delove linka
    expect(link).toContain("calendar.google.com");
    expect(link).toContain("test+quiz"); // Razmak mora biti zamenjen sa + ili %20
    expect(link).toContain("20260520T200000Z"); // Provera formata vremena
  });
});