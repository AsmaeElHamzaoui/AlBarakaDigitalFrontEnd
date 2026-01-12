import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/role.enum';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <aside class="sidebar" *ngIf="userRole">
      <div class="sidebar-header">
        <h3>Menu</h3>
      </div>
      
      <nav class="sidebar-nav">
        <!-- Client Menu -->
        <ng-container *ngIf="userRole === Role.CLIENT">
          <a routerLink="/client/dashboard" routerLinkActive="active" class="sidebar-link">
            📊 Tableau de bord
          </a>
          <a routerLink="/client/operations" routerLinkActive="active" class="sidebar-link">
            💰 Opérations
          </a>
          <a routerLink="/client/account" routerLinkActive="active" class="sidebar-link">
            👤 Mon compte
          </a>
        </ng-container>

        <!-- Agent Menu -->
        <ng-container *ngIf="userRole === Role.AGENT_BANCAIRE">
          <a routerLink="/agent/dashboard" routerLinkActive="active" class="sidebar-link">
            📊 Tableau de bord
          </a>
          <a routerLink="/agent/pending-operations" routerLinkActive="active" class="sidebar-link">
            ⏳ Opérations en attente
          </a>
        </ng-container>

        <!-- Admin Menu -->
        <ng-container *ngIf="userRole === Role.ADMIN">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="sidebar-link">
            📊 Tableau de bord
          </a>
          <a routerLink="/admin/users" routerLinkActive="active" class="sidebar-link">
            👥 Gestion utilisateurs
          </a>
        </ng-container>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background: #f8f9fa;
      border-right: 1px solid #dee2e6;
      min-height: calc(100vh - 70px);
      padding: 1.5rem 0;
    }

    .sidebar-header {
      padding: 0 1.5rem 1rem;
      border-bottom: 1px solid #dee2e6;
      margin-bottom: 1rem;
      
      h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #495057;
      }
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
    }

    .sidebar-link {
      padding: 0.75rem 1.5rem;
      color: #495057;
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      
      &:hover {
        background: #e9ecef;
        color: #1e3c72;
      }
      
      &.active {
        background: #e7f1ff;
        color: #1e3c72;
        border-left-color: #1e3c72;
        font-weight: 600;
      }
    }
  `]
})
export class SidebarComponent {
  private authService = inject(AuthService);
  
  Role = Role;
  
  get userRole(): Role | null {
    return this.authService.getUserRole();
  }
}
