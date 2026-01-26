import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError,of } from 'rxjs';
import { AccountRequestDTO, AccountResponseDTO } from '../models/account.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/client/accounts`;

  createAccount(accountRequest: AccountRequestDTO): Observable<AccountResponseDTO> {
    return this.http.post<AccountResponseDTO>(this.API_URL, accountRequest);
  }

  getMyAccount(): Observable<AccountResponseDTO> {
    return this.http.get<AccountResponseDTO>(`${this.API_URL}/me`);
  }

  // Optionnel : méthode qui tente de récupérer et retourne null si 404
  getMyAccountOrNull(): Observable<AccountResponseDTO | null> {
    return this.getMyAccount().pipe(
      catchError(err => {
        if (err.status === 404) {
          return of(null);
        }
        return throwError(() => err);
      })
    );
  }
}