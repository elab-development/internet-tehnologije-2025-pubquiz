import { NextResponse } from "next/server";
import { getAuthUser, isAdmin } from "@/lib/auth"; 
import { db } from "@/db";
import { teams } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const adminAccess = await isAdmin();
    if (!adminAccess) {
      return NextResponse.json({ error: "Zabranjen pristup: Samo admin moze videti sve timove" }, { status: 403 });
    }

    const allTeams = await db.query.teams.findMany({
      orderBy: [desc(teams.createdAt)]
    });

    return NextResponse.json(allTeams, { status: 200 });
  } catch (error: any) {
    console.error("GET TEAMS ERROR:", error);
    return NextResponse.json({ error: "Greska na serveru prilikom dohvatanja timova" }, { status: 500 });
  }
}