import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';
import {
  LoginRequest,
  LoginResponse,
  OAuth2LoginResponse,
  UserRequestDTO,
  UserResponseDTO,
  User
} from '../models/user.model';
import { Role } from '../models/role.enum';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  private readonly API_URL = `${environment.apiUrl}/auth`;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Initialiser l'utilisateur au chargement si token valide
    if (this.tokenService.isAuthenticated()) {
      this.loadCurrentUser();
    }
  }

  // Login classique avec JWT
  login(credentials: LoginRequest): Observable<any> {
  return this.http.post<any>(`${this.API_URL}/login`, credentials)
    .pipe(
      tap(response => {
        // Ici on prend le bon champ : accessToken
        this.tokenService.setToken(response.accessToken);
        this.loadCurrentUser();
      }),
      catchError(error => {
        console.error('Erreur lors de la connexion', error);
        return throwError(() => error);
      })
    );
}


  // Login OAuth2 avec Keycloak
  loginOAuth2(credentials: LoginRequest): Observable<OAuth2LoginResponse> {
    return this.http.post<OAuth2LoginResponse>(`${this.API_URL}/login/oauth2`, credentials)
      .pipe(
        tap(response => {
          this.tokenService.setOAuth2Token(response.accessToken);
        }),
        catchError(error => {
          console.error('Erreur lors de la connexion OAuth2', error);
          return throwError(() => error);
        })
      );
  }

  // Inscription
  register(userRequest: UserRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.API_URL}/register`, userRequest)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de l\'inscription', error);
          return throwError(() => error);
        })
      );
  }

  // Déconnexion
  logout(): void {
    this.tokenService.removeTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // Charger les informations de l'utilisateur connecté
  private loadCurrentUser(): void {
    const email = this.tokenService.getUserEmail();
    const role = this.tokenService.getUserRole();
    
    if (email && role) {
      // Créer un objet User basique depuis le token
      const user: User = {
        id: 0, // Sera mis à jour si nécessaire
        email,
        fullName: '', // Sera mis à jour si nécessaire
        role,
        active: true,
        createdAt: new Date()
      };
      this.currentUserSubject.next(user);
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  // Récupérer le rôle de l'utilisateur
  getUserRole(): Role | null {
    return this.tokenService.getUserRole();
  }

  // Récupérer l'email de l'utilisateur
  getUserEmail(): string | null {
    return this.tokenService.getUserEmail();
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: Role): boolean {
    return this.tokenService.hasRole(role);
  }

  // Rediriger selon le rôle
  redirectByRole(): void {
    const role = this.getUserRole();
    
    switch (role) {
      case Role.CLIENT:
        this.router.navigate(['/client/dashboard']);
        break;
      case Role.AGENT_BANCAIRE:
        this.router.navigate(['/agent/dashboard']);
        break;
      case Role.ADMIN:
        this.router.navigate(['/admin/dashboard']);
        break;
      default:
        this.router.navigate(['/auth/login']);
    }
  }
}