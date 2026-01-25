'use client' 
//Ova komponenta (i sve koje ona uveze) treba da se pošalje u pretraživač kako bi korisnik mogao da ima interakciju sa njom
//i obavezno je kada se koristi UseState, useEffect, useContext, useReducer, useRef
//onClick, onChange, onSubmit

import { useState } from "react";
import { usePathname } from "next/navigation";
//da znamo na kojoj smo strani, i da oznacimo aktivnu stranicu
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar(){
   const [isOpen, setIsOpen] = useState(false); 
   const pathname = usePathname();

   return (
    <nav className="bg-neutral-950 text-white border-b">

        <div className="px-4 py-2 flex justify-between items-center">
            {/*   home  */}
            <Link href="/" className="font-bold text-xl">Home</Link>

            {/*   desktop menu: kalendar rang lista  */}
            <div className="hidden md:flex gap-6"> {/*cim ekran postane medium posnistava se hidden*/}
                <Link href="/calendar" className={pathname == '/calendar' ? 'text-yellow-500' : ''}>Calendar</Link>
                <Link href="/table" className={pathname == '/table' ? 'text-yellow-500':''}>Leaderboard</Link>
            </div>

            {/*   mobile menu: kalendar rang lista  */}
            <button className="md:hidden border rounded" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28}/> : <Menu size={28}/>}
            </button>


        </div>

        {/*hamburger menu 
        {isOpen && } ako je  isOpen=false meni je zatvoren i ignorise se sledeci div
        idOpen=true iscrtava se div
        md:hidden ako se neko prebaci na tel na desktop prikaz ili landscape
        flex-col jedan ispod drugog
        onClick={() => setIsOpen(false) da ne ostane otvoren meni kada se prebaci na drugu stranu
        
        */}
        
        {isOpen && (
            <div className="md:hidden flex flex-col gap-3 border-t pl-4 py-2">
                <Link href="/calendar" onClick={() => setIsOpen(false)}>Calendar</Link>
                <Link href="/table" onClick={() => setIsOpen(false)}>Leaderboard</Link>
            </div>         
        )}
        
    </nav>

   );
}


