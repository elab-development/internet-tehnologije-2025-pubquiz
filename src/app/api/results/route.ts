import { NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth-utils";
import { db } from "@/db";
import { seasons, events, results, teams } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function GET(request: Request) {
  
  const allResults = await db.query.results.findMany({
    with: { team: true, event: true }
  });
  return NextResponse.json(allResults, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: "Zabranjeno: Samo admin unosi rezultate" }, { status: 403 });
    }

    const body = await request.json();


    if (!body.eventId || !body.teamId || body.points === undefined) {
       return NextResponse.json({ error: "Nedostaju podaci: eventId, teamId ili points" }, { status: 400 });
    }

    
    const newResult = await db.insert(results).values({
      
      
      eventId: Number(body.eventId),
      teamId: Number(body.teamId),
      points: Number(body.points),
  
    }).returning();

    return NextResponse.json(newResult, { status: 201 });

  } catch (error: any) {
    console.error("GRESKA REZULTATI:", error);
    

    if (error.code === '23505') {
        return NextResponse.json({ error: "Rezultat za ovaj tim na ovom kvizu već postoji!" }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Greška na serveru", details: error.message }, 
      { status: 500 }
    );
  }
}