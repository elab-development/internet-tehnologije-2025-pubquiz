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
        name: "Zimska Liga 2025",
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-03-31"),
      },
      {
        name: "Prolećni Kup",
        startDate: new Date("2025-04-01"),
        endDate: new Date("2025-06-15"),
      },
      {
        name: "Letnja Liga (Open Air)",
        startDate: new Date("2025-07-01"),
        endDate: new Date("2025-08-31"),
      },
    ]).returning(); // vraca ubacene sezone sa njihovim id-jem

    const winterSeason = insertedSeasons[0]; // Uzimamo prvu zimsku ligu za povezivanje

    console.log("Sezone dodate.");

    
    const insertedEvents = await db.insert(events).values([
      {
        seasonId: winterSeason.id, 
        title: "Kviz #1: Opšte Znanje",
        dateTime: new Date("2025-01-20T20:00:00"),
        location: "Pub Centar",
        description: "Prvi kviz u sezoni.",
      },
      {
        seasonId: winterSeason.id,
        title: "Kviz #2: Muzika",
        dateTime: new Date("2025-01-27T20:00:00"),
        location: "Pub Centar",
        description: "Specijal muzicki kviz.",
      }
    ]).returning();

    console.log("Događaji dodati.");

    
    await db.insert(users).values({
      email: "admin@kviz.com",
      passwordHash: "admin123", // Ovde ide hash 
      role: "ADMIN",
    });

    
   
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash("sifra1", salt);

const [userTim1] = await db.insert(users).values({
  email: "mkc@gmail.com",
  passwordHash: hashedPassword, // hashovana sifra
  role: "TEAM",
  name: "MKC Tim",
}).returning();
    
    const [userTim2] = await db.insert(users).values({
      email: "pametni@gmail.com",
      passwordHash: "sifra2",
      role: "TEAM",
    }).returning();

    console.log("Korisnici dodati.");

    
    const [team1] = await db.insert(teams).values({
      userId: userTim1.id,
      teamName: "MKC",
      teamLeader: "Mika Mikic",
      members: "Pera, Laza, Zika",

    }).returning();

    const [team2] = await db.insert(teams).values({
      userId: userTim2.id,
      teamName: "Pametnjakovici",
      teamLeader: "Ana Anic",
      members: "Sanja, Marko",
    }).returning();

    console.log("Timovi dodati.");

    
    await db.insert(results).values([
      {
        eventId: insertedEvents[0].id, 
        teamId: team1.id,           
        points: 10,
      },
      {
        eventId: insertedEvents[0].id,
        teamId: team2.id,            
        points: 8,
      }
    ]);

    console.log("Rezultati dodati.");
    

  } catch (error) {
    console.error("Došlo je do greške:", error);
  }
  
  process.exit(0);
}

main();