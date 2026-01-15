import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-agent',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <h1>🏦 Tableau de bord Agent</h1>

      <div class="cards">
        <a routerLink="/agent/operations/pending" class="card">
          📄 Opérations en attente
        </a>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      box-shadow: 0 4px 10px rgba(0,0,0,.05);
      transition: transform .2s;
    }

    .card:hover {
      transform: translateY(-5px);
    }
  `]
})
export class DashboardAgentComponent {}
