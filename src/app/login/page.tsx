"use client";

import React, { useState } from 'react';

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
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Prijava na Pub Kviz
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Polje za Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
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
            <label className="block text-sm font-medium text-gray-700">Lozinka</label>
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
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Prijavi se
          </button>
        </form>
      </div>
    </div>
  );
}