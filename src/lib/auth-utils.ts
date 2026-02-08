import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;

export async function getCurrentUser( request: Request): Promise<User | null> {

  const userId = request.headers.get("x-user-id");
  if (!userId) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return user ?? null;
}

export function isUserAdmin(user: User | null): boolean {
  return user?.role === "ADMIN";
}
