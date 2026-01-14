import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AccountRequestDTO, AccountResponseDTO } from '../models/account.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/client/accounts`;

  // Créer un compte bancaire
  createAccount(accountRequest: AccountRequestDTO): Observable<AccountResponseDTO> {
    return this.http.post<AccountResponseDTO>(this.API_URL, accountRequest)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la création du compte', error);
          return throwError(() => error);
        })
      );
  }

  // Récupérer le compte de l'utilisateur connecté
  getMyAccount(): Observable<AccountResponseDTO> {
    return this.http.get<AccountResponseDTO>(`${this.API_URL}/me`)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la récupération du compte', error);
          return throwError(() => error);
        })
      );
  }
}
