import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { OperationRequestDTO, OperationResponseDTO } from '../models/operation.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/client/operations`;

  // Créer une opération
  createOperation(operationRequest: OperationRequestDTO): Observable<OperationResponseDTO> {
    return this.http.post<OperationResponseDTO>(this.API_URL, operationRequest)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la création de l\'opération', error);
          return throwError(() => error);
        })
      );
  }

  // Récupérer les opérations du client connecté
  getMyOperations(): Observable<OperationResponseDTO[]> {
    return this.http.get<OperationResponseDTO[]>(this.API_URL)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la récupération des opérations', error);
          return throwError(() => error);
        })
      );
  }
}