import { db } from "@/db";
import { teams, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function TeamProfilePage(props: { params: Promise<{ id: string }> }) {
  
  const params = await props.params;
  const idParam = params.id;

  // 1. Logika za pretragu tima (da li je ID broj ili UUID)
  const isIdNumber = /^\d+$/.test(idParam);
  let team;

  if (isIdNumber) {
    team = await db.query.teams.findFirst({
      where: eq(teams.id, parseInt(idParam)),
    });
  } else {
    team = await db.query.teams.findFirst({
      where: eq(teams.userId, idParam),
    });
  }

  if (!team) return notFound();

  
  const user = await db.query.users.findFirst({
    where: eq(users.id, team.userId)
  });

  
  const membersList = team.members 
    ? team.members.split(",").map(m => m.trim()) 
    : [];

  return (
    <main className="p-8 flex justify-center">
      
      <div className="w-full max-w-md border border-neutral-800 bg-neutral-900 p-6 rounded-lg">
        
        
        <div className="border-b border-neutral-800 pb-4 mb-4">
          <h1 className="text-2xl font-bold mb-1">{team.teamName}</h1>
          <p className="text-neutral-400 text-sm">Leader: {team.teamLeader}</p>
          <p className="text-neutral-400 text-sm">Email: {user?.email}</p>
        </div>

        
        <div>
          <h2 className="text-sm font-bold uppercase text-neutral-500 mb-2">Team members</h2>
          
          {membersList.length > 0 ? (
            <ul className="list-disc list-inside text-neutral-300 space-y-1">
              {membersList.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-600 text-sm italic">No members enrolled.</p>
          )}
        </div>

      </div>

    </main>
  );
}