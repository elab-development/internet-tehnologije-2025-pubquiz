"use client";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  onClick: () => void;
  showAll: boolean;
  totalCount: number;
};

export default function ShowAllButton({ onClick, showAll, totalCount }: Props) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 hover:text-yellow-500 uppercase tracking-widest transition-colors"
    >
      {showAll ? (
        <>Show Less <ChevronUp size={14} /></>
      ) : (
        <>Show All ({totalCount}) <ChevronDown size={14} /></>
      )}
    </button>
  );
}