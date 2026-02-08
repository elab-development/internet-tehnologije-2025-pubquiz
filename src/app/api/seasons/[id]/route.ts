import { NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth-utils";
import { db } from "@/db";
import { seasons } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(request);
  const { id } = await params;

  if (!isUserAdmin(user)) {
    return NextResponse.json({ error: "Zabranjen pristup" }, { status: 403 });
  }

 
  const existingSeason = await db.query.seasons.findFirst({ where: eq(seasons.id, parseInt(id)) });
  
  if (!existingSeason) {
    return NextResponse.json({ error: "Sezona ne postoji" }, { status: 404 });
  }

  await db.delete(seasons).where(eq(seasons.id, parseInt(id)));
  return NextResponse.json({ message: "Sezona obrisana" }, { status: 200 });
}