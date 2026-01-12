import { Injectable } from '@angular/core';
import { JwtPayload } from '../models/jwt-payload.model';
import { Role } from '../models/role.enum';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'albaraka_token';
  private readonly OAUTH2_TOKEN_KEY = 'albaraka_oauth2_token';

  // Stockage du token JWT
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Récupération du token JWT
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Stockage du token OAuth2
  setOAuth2Token(token: string): void {
    localStorage.setItem(this.OAUTH2_TOKEN_KEY, token);
  }

  // Récupération du token OAuth2
  getOAuth2Token(): string | null {
    return localStorage.getItem(this.OAUTH2_TOKEN_KEY);
  }

  // Suppression des tokens
  removeTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.OAUTH2_TOKEN_KEY);
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  // Décodage du token JWT
  decodeToken(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload) as JwtPayload;
    } catch (error) {
      console.error('Erreur lors du décodage du token', error);
      return null;
    }
  }

  // Récupérer le rôle de l'utilisateur
  getUserRole(): Role | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodeToken(token);
    return payload?.role || null;
  }

  // Récupérer l'email de l'utilisateur
  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodeToken(token);
    return payload?.sub || null;
  }

  // Vérifier si le token est expiré
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;

    const expirationDate = new Date(payload.exp * 1000);
    return expirationDate < new Date();
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: Role): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }
}