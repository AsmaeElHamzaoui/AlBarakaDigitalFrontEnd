import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DocumentResponseDTO {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  uploadDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/client/operations`;

  // Upload un justificatif
  uploadDocument(operationId: number, file: File): Observable<DocumentResponseDTO> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<DocumentResponseDTO>(
      `${this.API_URL}/${operationId}/document`, 
      formData
    ).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'upload du document', error);
        return throwError(() => error);
      })
    );
  }
}