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