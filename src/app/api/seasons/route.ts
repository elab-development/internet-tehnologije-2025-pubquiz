import { NextResponse } from "next/server";
import { db } from "@/db"; 
import { seasons } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.query.seasons.findMany({
      orderBy: [desc(seasons.startDate)]
    });
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    const result = await db.insert(seasons).values({
      name: body.name,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    }).returning();
    
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}