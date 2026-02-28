import { NextResponse } from "next/server";
import { db } from "@/db";
import { results, seasons } from "@/db/schema";
import { desc, asc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const allResults = await db.query.results.findMany({
      with: {
        team: true,
        event: {
          with: {
            season: true 
          }
        }
      },
      // sortira tako da najnoviji rezultati budu prvi
      // to znaci da ce najstarija sezona zavrsiti na dnu tabele
      orderBy: [desc(results.id)] 
    });

    return NextResponse.json(allResults, { status: 200 });
  } catch (error) {
    console.error("Greska prilikom dohvatanja rezultata:", error);
    return NextResponse.json({ error: "Greska na serveru" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, teamId, points } = body;

    if (!eventId || !teamId || points === undefined) {
      return NextResponse.json({ error: "Sva polja su obavezna" }, { status: 400 });
    }

    const newResult = await db.insert(results).values({
      eventId: parseInt(eventId),
      teamId: teamId,
      points: parseInt(points),
    }).returning();

    return NextResponse.json(newResult[0], { status: 201 });
  } catch (error) {
    console.error("Greška prilikom čuvanja rezultata:", error);
    return NextResponse.json({ error: "Greska na serveru" }, { status: 500 });
  }
}