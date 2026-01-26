import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserResponseDTO } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http = inject(HttpClient);
  private API = `${environment.apiUrl}/api/admin/users`;

  getAllUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(this.API);
  }

  getUserById(id: number): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.API}/${id}`);
  }

  activateUser(id: number): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.API}/${id}/activate`, {});
  }

  deactivateUser(id: number): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.API}/${id}/deactivate`, {});
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
