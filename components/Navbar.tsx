'use client'

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "../components/AuthProvider"; 

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfilOpen, setIsProfilOpen] = useState(false);
    const pathname = usePathname();

    // 2. Izvuci podatke iz AuthProvider-a
    const { status, user, logout } = useAuth();
    const isLoggedIn = status === "authenticated";

    const disableNavbarRoutes = ['/login', '/register'];
    if (disableNavbarRoutes.includes(pathname)) {
        return null;
    }

    // Funkcija za odjavu koja zatvara i menije
    const handleLogout = async () => {
        await logout();
        setIsProfilOpen(false);
        setIsOpen(false);
    };

    return (
        <nav className="bg-neutral-950 text-white border-b relative">
            <div className="px-4 py-2 flex justify-between items-center max-w-7xl mx-auto">
                {/* Logo */}
                <Link href="/" className="font-bold text-xl">Home</Link>

                {/* Mobile menu toggle */}
                <button className="md:hidden border rounded p-1" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/calendar" className={pathname == '/calendar' ? 'text-yellow-500' : 'hover:text-yellow-400'}>Calendar</Link>
                    <Link href="/table" className={pathname == '/table' ? 'text-yellow-500' : 'hover:text-yellow-400'}>Leaderboard</Link>

                    {isLoggedIn ? (
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfilOpen(!isProfilOpen)} 
                                className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full hover:bg-neutral-800 transition"
                            >
                                <span className="text-sm text-yellow-500">{user?.name}</span>
                                <User size={20} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfilOpen && (
                                <>
                                    {/* Transparentna podloga koja zatvara meni na klik bilo gde */}
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfilOpen(false)}></div>
                                    
                                    <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded shadow-xl z-50 overflow-hidden">
                                        <div className="px-4 py-2 border-b border-neutral-800 text-xs text-neutral-400 uppercase">Korisnik</div>
                                        <Link 
                                            href="/profile" 
                                            onClick={() => setIsProfilOpen(false)}
                                            className="px-4 py-3 hover:bg-neutral-800 text-sm block"
                                        >
                                            My Profile
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 text-red-500 hover:bg-neutral-800 text-sm border-t border-neutral-800"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="font-bold text-yellow-500 hover:text-yellow-400">Log In</Link>
                            <Link href="/register" className="bg-yellow-500 text-black px-4 py-1.5 rounded font-bold hover:bg-yellow-400 transition">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu (Hamburger) */}
            {isOpen && (
                <div className="md:hidden flex flex-col gap-3 border-t pl-4 py-4 bg-neutral-900 text-sm animate-in fade-in slide-in-from-top-2">
                    <Link href="/calendar" onClick={() => setIsOpen(false)}>Calendar</Link>
                    <Link href="/table" onClick={() => setIsOpen(false)}>Leaderboard</Link>
                    
                    {isLoggedIn ? (
                        <>
                            <Link href="/profile" onClick={() => setIsOpen(false)}>My Profile ({user?.name})</Link>
                            <button onClick={handleLogout} className="text-left text-red-500 font-bold">Log out</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setIsOpen(false)} className="text-yellow-500 font-bold">Log In</Link>
                            <Link href="/register" onClick={() => setIsOpen(false)} className="text-yellow-500 font-bold italic">Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}