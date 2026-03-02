import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as jwt from "jsonwebtoken";
import { signAuthToken, verifyAuthToken, JwtUserClaims } from '../src/lib/auth';

process.env.JWT_SECRET = "test_tajna_sifra_123";

describe('Autentifikacija (JWT)', () => {
  
  const mockUser: JwtUserClaims = {
    id: "user_123",
    sub: "user_123",
    email: "test@kviz.com",
    role: "ADMIN"
  };

  it('treba uspešno da kreira (potpiše) JWT token', () => {
    const token = signAuthToken(mockUser);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT se uvek sastoji od 3 dela odvojena tačkom
  });

  it('treba uspesno da verifikuje ispravan token i vrati podatke', () => {
    const token = signAuthToken(mockUser);
    const decoded = verifyAuthToken(token);
    
    expect(decoded.email).toBe(mockUser.email);
    expect(decoded.role).toBe("ADMIN");
  });

  it('treba da baci gresku ako je token nevalidan', () => {
    const falsyToken = "neki.nasumicni.string";
    
    // Proveravamo da li funkcija baca Error kada dobije los token
    expect(() => verifyAuthToken(falsyToken)).toThrow();
  });

  it('treba da baci gresku ako je token potpisan pogresnim kljucem', () => {
    const invalidPass = jwt.sign(mockUser, "sifra");
    
    expect(() => verifyAuthToken(invalidPass)).toThrow();
  });
});