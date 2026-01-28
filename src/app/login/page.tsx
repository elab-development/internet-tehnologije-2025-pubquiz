"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pokušaj prijave sa:", email, password);
    // dodati logiku za proveru u bazi
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      
      {/* kartica u centru */}
      <div className="bg-neutral-800 p-8 rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-yellow-500">
          Prijava na Pub Kviz
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Polje za Email */}
          <div>
            <label className="block text-sm font-medium text-yellow-500">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Unesite svoj email"
              required
            />
          </div>

          {/* Polje za Lozinku */}
          <div>
            <label className="block text-sm font-medium text-yellow-500">Lozinka</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Dugme za Login */}
          <button 
            type="submit"
            className="w-full bg-yellow-500 text-black font-bold p-2 rounded-md hover:bg-yellow-200 transition duration-200"
          >
            Prijavi se
          </button>
          <div className="flex justify-center">
          <Link 
              href="../" 
              className="flex items-center text-neutral-500 text-sm hover:text-gray-900"
          >
              <ArrowLeft size={16} className="mr-2" />
              Back home
            </Link>
          </div>
          
        </form>
      </div>
    </div>
  );
}