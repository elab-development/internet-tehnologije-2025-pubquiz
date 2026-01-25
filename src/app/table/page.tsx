export default function TabelaPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-neutral-300">
        Leaderboard
      </h1>

      {/* Ovde počinje vizuelna tabela */}
      <div>
        <table className="max-w-5xl w-full mx-auto bg-neutral-950 border border-yellow-700">
          
          {/* Zaglavlje tabele */}
          <thead className="bg-yellow-700 text-white">
            <tr>
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Team Name</th>
              <th className="p-4 text-left">Score</th>
            </tr>
          </thead>

          
          <tbody className="divide-y divide-yellow-700">
            
            <tr className="hover:bg-neutral-700">
              <td className="p-4 font-bold text-yellow-400">1.</td>
              <td className="p-4 font-bold">Veri bjutiful gerls</td>
              <td className="p-4 text-xl">120</td>
            </tr>

            
            <tr className="hover:bg-neutral-700">
              <td className="p-4 font-bold text-gray-300">2.</td>
              <td className="p-4">Team Red</td>
              <td className="p-4 text-xl">95</td>
            </tr>

            
            <tr className="hover:bg-neutral-700">
              <td className="p-4 font-bold text-orange-700">3.</td>
              <td className="p-4">Team Blue</td>
              <td className="p-4 text-xl">88</td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>
  );
}