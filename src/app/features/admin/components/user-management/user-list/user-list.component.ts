import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { UserResponseDTO } from '../../../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <h1>👥 Utilisateurs</h1>

    <app-loading-spinner *ngIf="loading" [isLoading]="true"></app-loading-spinner>

    <table *ngIf="!loading">
      <thead>
        <tr>
          <th>Email</th>
          <th>Rôle</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let user of users">
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <span [class.active]="user.active" [class.inactive]="!user.active">
              {{ user.active ? 'Actif' : 'Inactif' }}
            </span>
          </td>
          <td>
            <a [routerLink]="['/admin/users', user.id]">🔍</a>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    table {
      width: 100%;
      background: white;
      border-radius: 12px;
      overflow: hidden;
    }

    th, td {
      padding: 1rem;
    }

    .active { color: #28a745; font-weight: 600; }
    .inactive { color: #dc3545; font-weight: 600; }
  `]
})
export class UserListComponent implements OnInit {

  private adminService = inject(AdminService);

  users: UserResponseDTO[] = [];
  loading = true;

  ngOnInit(): void {
    this.adminService.getAllUsers().subscribe(users => {
      this.users = users;
      this.loading = false;
    });
  }
}
