import { NextResponse } from "next/server";
import { db } from "@/db";
import { teams } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser(); 

  if (!user || user.role !== "TEAM") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const teamProfile = await db.query.teams.findFirst({
      where: eq(teams.userId, user.id),
        with: {
        results: {
          with: {
            event: true 
          }
        }
      }
    });

    if (!teamProfile) {
      console.log("No team associated with this user:", user.id);
      return NextResponse.json({ error: "Team profile not found" }, { status: 404 });
    }

    return NextResponse.json(teamProfile);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getAuthUser();

  if (!user || user.role !== "TEAM") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { teamName, captainName, members } = body;

    const updated = await db.update(teams)
      .set({
        teamName,
        captainName,
        members
      })
      .where(eq(teams.userId, user.id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    if (error.code === '23505') {
       return NextResponse.json({ error: "Ime tima je zauzeto" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}