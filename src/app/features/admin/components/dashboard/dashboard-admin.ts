import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <h1>⚙️ Tableau de bord Admin</h1>

      <div class="cards">
        <a routerLink="/admin/users" class="card">
          👥 Gestion des utilisateurs
        </a>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }

    .cards {
      margin-top: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,.05);
      transition: transform .2s;
    }

    .card:hover {
      transform: translateY(-4px);
    }
  `]
})
export class DashboardAdminComponent {}
