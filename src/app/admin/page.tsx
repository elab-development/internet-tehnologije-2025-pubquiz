"use client";
import Link from "next/link";
import { CalendarDays, MessageCircleQuestionMark, UsersRound, ChartColumn   } from 'lucide-react';



export default function AdminDashboard() {
  const menuItems = [
    { title: "Seasons", desc: "Full management of league cycles and dates", href: "/admin/seasons", icon: <CalendarDays size={36} className="text-yellow-500" />},
    { title: "Quizzes", desc: "Create, edit, and organize quiz events", href: "/admin/events", icon: <MessageCircleQuestionMark size={36} className="text-yellow-500" />},
    { title: "Teams", desc: "View and manage participants", href: "/admin/teams", icon: <UsersRound  size={36} className="text-yellow-500" />},
    { title: "Results", desc: "Record and manage score entries", href: "/admin/results", icon: <ChartColumn  size={36} className="text-yellow-500" />},
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <header className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-6xl font-black text-yellow-500 uppercase tracking-tighter">
          Admin <span className="text-white">Panel</span>
        </h1>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.title} className="group">
            <div className="bg-neutral-950/30 border border-gray-800/80 p-8 rounded-2xl hover:border-yellow-500 h-full">
              <div className="mb-4">{item.icon}</div>
              <h2 className="text-2xl font-black text-white group-hover:text-yellow-500 uppercase">
                {item.title}
              </h2>
              <p className="text-gray-500 mt-2">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}