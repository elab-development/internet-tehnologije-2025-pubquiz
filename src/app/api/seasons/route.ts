import { NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "../../../lib/auth-utils";
import { db } from "@/db";
import { seasons } from "@/db/schema";


export async function GET() {
  const allSeasons = await db.query.seasons.findMany();
  return NextResponse.json(allSeasons, { status: 200 });
}


export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);

    if (!isUserAdmin(user)) {
      return NextResponse.json(
        { error: "Zabranjen pristup: Samo Admin može kreirati sezonu" },
        { status: 403 }
      );
    }

    const body = await request.json();

    
    const newSeason = await db.insert(seasons).values({
      name: body.name, 
      startDate: new Date(body.startDate), 
      endDate: new Date(body.endDate),
    }).returning();
    
    return NextResponse.json(newSeason, { status: 201 });

  } catch (error) {
    console.error("GRESKA U POST /api/seasons:", error);
    return NextResponse.json(
      { error: "Došlo je do greške na serveru", details: String(error) }, 
      { status: 500 }
    );
  }
}