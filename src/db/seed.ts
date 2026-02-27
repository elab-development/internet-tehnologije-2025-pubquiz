import "dotenv/config";
import { db } from "./index";
import { seasons, events, users, teams, results, admins } from "./schema";
import bcrypt from "bcryptjs";

async function main() {
  try {

    await db.delete(results);
    await db.delete(events);
    await db.delete(teams);
    await db.delete(admins);
    await db.delete(users);
    await db.delete(seasons);

    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash("admin123", salt);
    const teamHash = await bcrypt.hash("sifra1", salt);

    const adminData = [
      { email: "admin@admin.com", name: "Admin" },
      { email: "marija@admin.com", name: "Marija" },
      { email: "luka@admin.com", name: "Luka" }
    ];

    for (const a of adminData) {
      await db.transaction(async (tx) => {
        const [newUser] = await tx.insert(users).values({
          email: a.email,
          passwordHash: adminHash,
          role: "ADMIN",
        }).returning();

        await tx.insert(admins).values({
          userId: newUser.id,
          fullName: a.name,
        });
      });
    }

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


    const extraTeamNames = [
      "MKC", "The Thunder", "Quiz Khalifas", "Les Quizerables",
      "John Trivialta", "Agatha Quiztie", "Universally Challenged", "Risky Quizness",
      "Smarty Pints", "Quizzly Bears", "Tequila Mockingbird", "The Know-It-Alls",
      "Fact Hunt", "Quiz Pro Quo", "Let's Get Quizzical"
    ];

    const insertedTeams: any[] = [];

    for (let i = 0; i < extraTeamNames.length; i++) {
      await db.transaction(async (tx) => {
        const [newUser] = await tx.insert(users).values({
          email: i === 0 ? "mkc@gmail.com" : `team${i + 2}@quiz.com`,
          passwordHash: teamHash,
          role: "TEAM",
        }).returning();

        const [newTeam] = await tx.insert(teams).values({
          userId: newUser.id,
          teamName: extraTeamNames[i],
          captainName: i === 0 ? "Mika Mikic" : `Captain ${i + 1}`,
          members: "Member A, Member B, Member C",
        }).returning();

        insertedTeams.push(newTeam);
      });
    }


    const now = new Date();

    for (const season of insertedSeasons) {
      const seasonStart = new Date(season.startDate);

      for (let i = 1; i <= 8; i++) {
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
          const resultsToInsert = insertedTeams.map((team) => ({
            eventId: event.id,
            teamId: team.id,
            points: Math.floor(Math.random() * 41) + 10, 
          }));

          await db.insert(results).values(resultsToInsert);
        }
      }
    }

    console.log("SEEDING COMPLETED SUCCESSFULLY");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    process.exit(0);
  }
}

main();