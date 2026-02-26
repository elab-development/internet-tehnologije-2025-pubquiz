import { NextResponse } from "next/server";
import { db } from "@/db";
import { seasons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";

export async function PATCH( req: Request, { params }: { params: Promise<{ id: string }>}) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const seasonId = parseInt(id);

    if (isNaN(seasonId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updated = await db.update(seasons)
      .set({
        name: body.name,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      })
      .where(eq(seasons.id, seasonId))
      .returning();

    return NextResponse.json(updated[0] || { success: true });
  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE( req: Request, { params }:{ params: Promise<{ id: string }>}) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = await params;
    const seasonId = parseInt(id);

    await db.delete(seasons).where(eq(seasons.id, seasonId));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}