import "dotenv/config";
import { db } from "./index";
import { seasons, events, users, teams, results } from "./schema";
import bcrypt from "bcryptjs";

async function main() {
  try {
     
    await db.delete(results);
    await db.delete(events);
    await db.delete(teams);
    await db.delete(users);
    await db.delete(seasons);

    const insertedSeasons = await db.insert(seasons).values([
      {
        name: "Trivia Nights Season 2025", 
        startDate: new Date("2025-09-06"),
        endDate: new Date("2025-12-29"),
      },
      {
        name: "Brain Battle Season 2026", 
        startDate: new Date("2026-01-31"),
        endDate: new Date("2026-06-06"),
      },
      {
        name: "Quiz League 2026", 
        startDate: new Date("2026-09-05"),
        endDate: new Date("2026-12-05"),
      },
    ]).returning();

    
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash("admin123", salt);
    const teamHash = await bcrypt.hash("sifra1", salt);

    
    await db.insert(users).values({
      email: "admin@quiz.com",
      passwordHash: adminHash,
      role: "ADMIN",
    });

    const insertedTeams = [];

    const [userMKC] = await db.insert(users).values({
      email: "mkc@gmail.com",
      passwordHash: teamHash,
      role: "TEAM",
    }).returning();

    const [teamMKC] = await db.insert(teams).values({
      userId: userMKC.id,
      teamName: "MKC",
      teamLeader: "Mika Mikic",
      members: "Pera, Laza, Zika",

    }).returning();
    insertedTeams.push(teamMKC);

    const extraTeamNames = [
      "The Thunder", "Quiz Khalifas", "Les Quizerables",
      "John Trivialta", "Agatha Quiztie", "Universally Challenged", "Risky Quizness",
      "Smarty Pints", "Quizzly Bears", "Tequila Mockingbird", "The Know-It-Alls",
      "Fact Hunt", "Quiz Pro Quo", "Let's Get Quizzical"
    ];

    for (let i = 0; i < extraTeamNames.length; i++) {
      const [user] = await db.insert(users).values({
        email: `team${i + 2}@quiz.com`,
        passwordHash: teamHash,
        role: "TEAM",
      }).returning();

      const [team] = await db.insert(teams).values({
        userId: user.id,
        teamName: extraTeamNames[i],
        teamLeader: `Captain ${i + 3}`,
        members: "Member A, Member B",
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
          location: i % 2 === 0 ? "Pub Centar" : "GreenFrog Pub",
          description: `Regular quiz round #${i} of ${season.name}.`,
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

    console.log("Seed skripta uspešno završena.");;

  } catch (error) {
    console.error("Došlo je do greške:", error);
  }

  process.exit(0);
}

main();