import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { UserResponseDTO } from '../../../../../core/models/user.model';

@Component({
  selector: 'app-user-details',
  standalone: true,
  template: `
    <div *ngIf="user">
      <h2>Détails utilisateur</h2>

      <p><strong>Email :</strong> {{ user.email }}</p>
      <p><strong>Rôle :</strong> {{ user.role }}</p>
      <p><strong>Statut :</strong> {{ user.active ? 'Actif' : 'Inactif' }}</p>

      <button (click)="toggleStatus()">
        {{ user.active ? 'Désactiver' : 'Activer' }}
      </button>

      <button class="danger" (click)="delete()">Supprimer</button>
    </div>
  `
})
export class UserDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminService = inject(AdminService);

  user!: UserResponseDTO;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.adminService.getUserById(id).subscribe(u => this.user = u);
  }

  toggleStatus(): void {
    const action = this.user.active
      ? this.adminService.deactivateUser(this.user.id)
      : this.adminService.activateUser(this.user.id);

    action.subscribe(u => this.user = u);
  }

  delete(): void {
    if (!confirm('Supprimer cet utilisateur ?')) return;

    this.adminService.deleteUser(this.user.id).subscribe(() => {
      this.router.navigate(['/admin/users']);
    });
  }
}
