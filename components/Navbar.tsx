'use client' 
//Ova komponenta (i sve koje ona uveze) treba da se pošalje u pretraživač kako bi korisnik mogao da ima interakciju sa njom
//i obavezno je kada se koristi UseState, useEffect, useContext, useReducer, useRef
//onClick, onChange, onSubmit

import { useState } from "react";
import { usePathname } from "next/navigation";
//da znamo na kojoj smo strani, i da oznacimo aktivnu stranicu
import Link from "next/link";
import { Menu, X, User} from "lucide-react";


export default function Navbar(){
    const [isOpen, setIsOpen] = useState(false); 
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfilOpen, setIsProfilOpen] = useState(false);

    const disableNavbarRoutes = ['/login', '/register'];
    if (disableNavbarRoutes.includes(pathname)) {
        return null;
    }

    

    return (
         <nav className="bg-neutral-950 text-white border-b">

            <div className="px-4 py-2 flex justify-between items-center">
            {/*   home  */}
                <Link href="/" className="font-bold text-xl">Home</Link>

            

            {/*   mobile menu: kalendar rang lista  */}
                <button className="md:hidden border rounded" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28}/> : <Menu size={28}/>}
                </button>

                <div className="hidden md:flex justify-between iteams-center gap-4">
                    <Link href="/calendar" className={pathname == '/calendar' ? 'text-yellow-500' : ''}>Calendar</Link>
                    <Link href="/table" className={pathname == '/table' ? 'text-yellow-500':''}>Leaderboard</Link>
                {/* 
                    {!isLoggedIn ? (
                        <>  //nije ulogovan
                            <button onClick={() => setIsLoggedIn(true)} className="text-yellow-500">
                                Log In
                            </button>
                            <Link href="/register" className="bg-yellow-500 text-black text-bold px-4 py- rounded font-medium">
                                Sign Up
                            </Link>                          
                        </> 
                    ) : ( 
                        <div>
                        jeste ulogovan 
                            <button onClick={() => setIsProfilOpen(!isProfilOpen)} >
                                 <User size={28} />
                            </button>
                            
                            <div className="absolute right-0 w-30 bg-neutral-900 border border-neutral-800 rounded flex flex-col">
                                <Link href="/profile" className="px-4 py-3 hover:bg-neutral-800 text-sm">
                                    My Profile
                                </Link>
                                <button onClick={() => { 
                                    setIsLoggedIn(false); 
                                    setIsProfilOpen(false); 
                                    }
                                }    
                                className="text-left px-4 py-3 text-red-500 hover:bg-neutral-800 text-sm">
                                    Log out
                                </button>

                            </div>
                         </div>
                    )
                }  */}

                    <Link href="/login" className="font-bold text-yellow-500">Log In</Link>
                    <Link href="/register" className="bg-yellow-500 text-black font-bold px-4 py- rounded font-medium">Sign Up</Link> 
                </div>

            </div>

        {/*hamburger menu 
        {isOpen && } ako je  isOpen=false meni je zatvoren i ignorise se sledeci div
        idOpen=true iscrtava se div
        md:hidden ako se neko prebaci na tel na desktop prikaz ili landscape
        flex-col jedan ispod drugog
        onClick={() => setIsOpen(false) da ne ostane otvoren meni kada se prebaci na drugu stranu
        
        */}
        
            {isOpen && (
                <div className="md:hidden flex flex-col gap-3 border-t pl-4 py-4 bg-neutral-900 text-xs">
                    <Link href="/calendar" onClick={() => setIsOpen(false)}>Calendar</Link>
                    <Link href="/table" onClick={() => setIsOpen(false)}>Leaderboard</Link>
                    <Link href="/profile" onClick={() => setIsOpen(false)}>My Profile</Link>
                {/*
            
                    {!isLoggedIn ? (
                        <button onClick={() => {
                            setIsLoggedIn(true); 
                            setIsOpen(false)
                            }} 
                            className="text-left text-yellow-500 font-bold">
                            Log In
                        </button>
                    ) : (
                        <button onClick={() => {
                            setIsLoggedIn(false); 
                            setIsOpen(false)}} 
                            className="text-left text-red-500">
                            Log out
                        </button>
                    )} */}
                    <Link href="/login" className="text-yellow-500 font-bold">Log In</Link>
                    <Link href="/register" className="font-bold italic text-yellow-500">Sign Up</Link> 
                </div>         
            )}
        
        </nav>

   );
}

// fali da kada se klikne bilo gde ili ponovo na ikonicu profila nestane padajuci meni
// da login vodi na login
//hamburger menu da se izbaci register ako je login

