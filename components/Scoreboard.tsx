"use client"; 

import { useState } from "react";

type TeamProps = {
  team: string;
  points: number;
};
type Props ={
 data: TeamProps[];
};

export default function ScoreboardTable({ data }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleData = isExpanded ? data : data.slice(0, 5);

  const showButton = data.length > 5;

  return (
    <>
      <table className="w-full text-left">
        <thead className="bg-neutral-950/30 text-xs uppercase text-neutral-500 font-medium">
          <tr>
            <th className="p-4 w-16 text-center"></th>
            <th className="p-4">Team</th>
            <th className="p-4 text-right">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {visibleData.map((row, index) => {
            let rowBg = "";
            let scoreColor = "text-neutral-300";
            let rankColor = "text-neutral-500";

            if (index === 0) {
              rowBg = "bg-yellow-500/10";
              scoreColor = "text-yellow-500";
              rankColor = "text-yellow-500";
            }

            return (
              <tr key={row.team} className={`hover:bg-neutral-800 ${rowBg}`}>
                <td className={`p-4 text-center font-bold ${rankColor}`}>
                  {index + 1}.
                </td>
                <td className="p-4 font-bold text-lg text-neutral-200">
                  {row.team}
                </td>
                <td className={`p-4 text-right font-bold text-xl ${scoreColor}`}>
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      
      {showButton && (
        <div className="p-4 border-t border-neutral-800 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-yellow-500 hover:text-yellow-300 tracking-wider"
          >
            {isExpanded ? "Show Less" : "Show All"}
          </button>
        </div>
      )}
    </>
  );
}