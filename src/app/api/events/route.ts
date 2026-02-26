import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth"; 
import { db } from "@/db";
import { events } from "@/db/schema"; 
import { desc } from "drizzle-orm";


export async function GET() {
  try {
    const allEvents = await db.query.events.findMany({
      orderBy: [desc(events.dateTime)],
    });
    return NextResponse.json(allEvents, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Greška pri ucitavanju kvizova" }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Zabranjen pristup" }, { status: 403 });
    }

    const body = await request.json();

    if (!body.title || !body.dateTime || !body.seasonId) {
      return NextResponse.json({ error: "Nedostaju obavezni podaci (naslov, datum ili sezona)" }, { status: 400 });
    }

    const eventDate = new Date(body.dateTime);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json({ error: "Neispravan format datuma" }, { status: 400 });
    }


    const [newEvent] = await db.insert(events).values({
      title: body.title,
      dateTime: eventDate,
      seasonId: body.seasonId, 
      location: body.location || "Default Venue",
      description: body.description || ""
    }).returning();

    return NextResponse.json(newEvent, { status: 201 });

  } catch (error) {
    console.error("EVENT_POST_ERROR:", error);
    return NextResponse.json(
      { error: "Doslo je do greske na serveru pri kreiranju dogadjaja" }, 
      { status: 500 }
    );
  }
}