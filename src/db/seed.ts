import "dotenv/config";
import { db } from "./index";
import { seasons, events, users, teams, results } from "./schema";

async function main() {
  try { 
    
    await db.delete(results);
    await db.delete(events);
    await db.delete(teams);
    await db.delete(users);
    await db.delete(seasons);
    
    const insertedSeasons = await db.insert(seasons).values([
      {
        name: "Spring/Summer 2025",
        startDate: new Date("2025-04-01"),
        endDate: new Date("2025-08-31"),
      },
      {
        name: "Autumn/Winter 25/26",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2026-03-31"),
      },
      {
        name: "Spring/Summer 2026",
        startDate: new Date("2026-04-01"),
        endDate: new Date("2026-08-31"),
      },
    ]).returning();

    await db.insert(users).values({
      email: "admin@quiz.com",
      passwordHash: "admin123",
      role: "ADMIN",
    });

    
    const teamNames = [
      "The Thunder", "The Brainiacs", "Quiz Khalifas", "Les Quizerables", 
      "John Trivialta", "Agatha Quiztie", "Universally Challenged", "Risky Quizness",
      "Smarty Pints", "Quizzly Bears", "Tequila Mockingbird", "The Know-It-Alls",
      "Fact Hunt", "Quiz Pro Quo", "Let's Get Quizzical"
    ];

    const insertedTeams = [];

    
    for (let i = 0; i < teamNames.length; i++) {
      const [user] = await db.insert(users).values({
        email: `team${i + 1}@quiz.com`,
        passwordHash: `pass${i + 1}`,
        role: "TEAM",
      }).returning();

      const [team] = await db.insert(teams).values({
        userId: user.id,
        teamName: teamNames[i],
        teamLeader: `Captain ${i + 1}`,
        members: "Member 1, Member 2, Member 3",
      }).returning();

      insertedTeams.push(team);
    }
    
    const now = new Date(); 

    
    for (const season of insertedSeasons) {
      const seasonStart = new Date(season.startDate);

      for (let i = 1; i <= 10; i++) {
        
        const quizDate = new Date(seasonStart);
        quizDate.setDate(quizDate.getDate() + (i * 7)); 
        quizDate.setHours(20, 0, 0, 0);

        
        const [event] = await db.insert(events).values({
          seasonId: season.id,
          title: `Quiz #${i}`,
          dateTime: quizDate,
          location: i % 2 === 0 ? "The Pub Center" : "GreenFrog Pub",
          description: `Regular quiz round #${i} of the season.`,
        }).returning();

        
        if (quizDate < now) {
            
            const resultsToInsert = insertedTeams.map((team) => {
              
              const randomPoints = Math.floor(Math.random() * 41) + 10;
              return {
                eventId: event.id,
                teamId: team.id,
                points: randomPoints,
              };
            });

            await db.insert(results).values(resultsToInsert);
        }
      }
    }

    console.log("Seed skripta zavrsena uspesno.");

  } catch (error) {
    console.error("Doslo je do greske:", error);
  }

  process.exit(0);
}

main();