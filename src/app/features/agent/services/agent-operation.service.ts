import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { OperationResponseDTO } from '../../client/models/operation.model';

@Injectable({
  providedIn: 'root'
})
export class AgentOperationService {

  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/agent/operations`;

  // opérations en attente
  getPendingOperations(): Observable<OperationResponseDTO[]> {
    return this.http.get<OperationResponseDTO[]>(`${this.API_URL}/pending`);
  }

  approveOperation(operationId: number): Observable<OperationResponseDTO> {
    return this.http.put<OperationResponseDTO>(
      `${this.API_URL}/${operationId}/approve`,
      {}
    );
  }

  rejectOperation(operationId: number): Observable<OperationResponseDTO> {
    return this.http.put<OperationResponseDTO>(
      `${this.API_URL}/${operationId}/reject`,
      {}
    );
  }

  downloadDocument(operationId: number): Observable<Blob> {
    return this.http.get(
      `${this.API_URL}/${operationId}/document`,
      { responseType: 'blob' }
    );
  }
}
