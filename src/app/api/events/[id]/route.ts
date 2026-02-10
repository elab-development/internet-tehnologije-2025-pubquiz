import { NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth-utils";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(request);
  const { id } = await params;

  if (!isUserAdmin(user)) {
    return NextResponse.json({ error: "Zabranjen pristup" }, { status: 403 });
  }

 
  const existingEvent = await db.query.events.findFirst({ where: eq(events.id, parseInt(id)) });
  
  if (!existingEvent) {
    return NextResponse.json({ error: "Event ne postoji" }, { status: 404 });
  }

  await db.delete(events).where(eq(events.id, parseInt(id)));
  return NextResponse.json({ message: "Event obrisan" }, { status: 200 });
}