import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function BtnBackToAdmin() {
  return (
    <Link 
      href="/admin" 
      className="flex items-center gap-1 text-neutral-500 hover:text-yellow-500 text-xs uppercase font-bold mt-8 justify-center transition-colors"
    >
      <ChevronLeft size={14} /> Back to Admin Panel
    </Link>
  );
}