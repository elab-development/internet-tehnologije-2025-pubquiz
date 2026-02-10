import { NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth-utils";
import { db } from "@/db";
import { events, seasons } from "@/db/schema"; 
import { eq } from "drizzle-orm";


export async function GET() {
  const calendar = await db.query.events.findMany({
    orderBy: (events, { asc }) => [asc(events.dateTime)],
    with: { season: true }
  });
  return NextResponse.json(calendar, { status: 200 });
}


export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });
    }

    const body = await request.json();

    const activeSeason = await db.query.seasons.findFirst({
      where: eq(seasons.id, body.seasonId)
    });

    if (!activeSeason) {
      return NextResponse.json({ error: "Ne možete kreirati događaj bez validne sezone" }, { status: 400 });
    }

    const newEvent = await db.insert(events).values({
      seasonId: body.seasonId,
      title: body.title,
      dateTime: new Date(body.date),
      location: body.location,
       description: body.description

    }).returning();

    return NextResponse.json(newEvent, { status: 201 });

  } catch (error) {
    console.error("GRESKA U POST /api/events:", error);
    return NextResponse.json(
      { error: "Greška na serveru", details: String(error) }, 
      { status: 500 }
    );
  }
}