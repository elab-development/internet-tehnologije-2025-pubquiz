import { NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth-utils";
import { db } from "@/db";
import { results, events } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function GET(request: Request) {
  
  const allResults = await db.query.results.findMany({
    with: { team: true, event: true }
  });
  return NextResponse.json(allResults, { status: 200 });
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request);

  if (!isUserAdmin(user)) {
    return NextResponse.json({ error: "Samo administrator može unositi rezultate" }, { status: 403 });
  }

  const body = await request.json();

  const eventExists = await db.query.events.findFirst({
    where: eq(events.id, body.eventId)
  });

  if (!eventExists) {
    return NextResponse.json({ error: "Događaj ne postoji" }, { status: 404 });
  }

  const newResult = await db.insert(results).values(body).returning();
  return NextResponse.json(newResult, { status: 201 });
}