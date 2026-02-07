"use client";


import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};


// Tip za stanje autentifikacije koje delimo kroz aplikaciju
type AuthState =
  | { status: "loading"; user: null }
  | { status: "unauthenticated"; user: null }
  | { status: "authenticated"; user: User };


// Tip podataka koji prosleđujemo React Context-u
// Sadrži trenutno stanje autentifikacije i funkciju za ponovno učitavanje auth podataka
type Ctx = AuthState & {
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};



// Kreiranje Auth konteksta (inicijalno nema vrednost)
const AuthContext = createContext<Ctx | null>(null);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Globalno stanje autentifikacije
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: null,
  });

// refresh funkcija poziva /api/auth/me rutu na back-endu
  // Proverava da li postoji validna sesija (cookie)
  // useCallback obezbeđuje da se funkcija ne rekreira pri svakom renderu
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include", // omogućava slanje cookie-ja
      });
      const data = await res.json();


      if (data?.user) {
        setState({ status: "authenticated", user: data.user });
      } else {
        setState({ status: "unauthenticated", user: null });
      }
    } catch {
      // U slučaju greške smatramo da korisnik nije autentifikovan
      setState({ status: "unauthenticated", user: null });
    }
  }, []);

  const logout = useCallback(async () => {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } finally {
    // Čak i ako API poziv ne uspe, želimo da izbacimo korisnika iz stanja
    setState({ status: "unauthenticated", user: null });
  }
}, []);

  // useEffect se izvršava pri prvom renderu
  // Pokreće proveru autentifikacije čim se aplikacija učita
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Memoizujemo vrednost konteksta kako bismo izbegli
  // nepotrebne rerender-e komponenti koje koriste kontekst
  const value = useMemo<Ctx>(() => ({ ...state, refresh, logout }), [state, refresh, logout]);


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


// Custom hook za pristup Auth kontekstu
// Koristi se u komponentama koje su unutar AuthProvider-a
export function useAuth() {
  const ctx = useContext(AuthContext);

  // Sprečava runtime grešku ako se hook koristi van AuthProvider-a
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return ctx;
}
