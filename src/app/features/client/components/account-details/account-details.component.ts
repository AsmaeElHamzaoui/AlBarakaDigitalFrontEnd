import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { AccountResponseDTO } from '../../models/account.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    AlertComponent,
    CurrencyFormatPipe,
    DateFormatPipe
  ],
  template: `
    <div class="account-details-container">
      <h1>Détails du compte</h1>

      <app-loading-spinner 
        *ngIf="isLoading" 
        [isLoading]="true"
        message="Chargement des détails du compte...">
      </app-loading-spinner>

      <app-alert 
        *ngIf="showError"
        type="error"
        [message]="errorMessage"
        [dismissible]="true"
        (closed)="showError = false">
      </app-alert>

      <div *ngIf="!isLoading && account" class="account-card">
        <div class="account-info-grid">
          <div class="info-item">
            <label>Numéro de compte</label>
            <span class="value">{{ account.numeroCompte }}</span>
          </div>

          <div class="info-item">
            <label>Solde</label>
            <span class="value balance">{{ account.solde | currencyFormat:account.devise }}</span>
          </div>

          <div class="info-item">
            <label>Devise</label>
            <span class="value">{{ account.devise }}</span>
          </div>

          <div class="info-item">
            <label>Date de création</label>
            <span class="value">{{ account.dateCreation | dateFormat:'long' }}</span>
          </div>

          <div class="info-item">
            <label>Statut</label>
            <span class="value" [class.active]="account.actif" [class.inactive]="!account.actif">
              {{ account.actif ? 'Actif' : 'Inactif' }}
            </span>
          </div>

          <div class="info-item">
            <label>Email du titulaire</label>
            <span class="value">{{ account.ownerEmail }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .account-details-container {
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;

      h1 {
        margin-bottom: 2rem;
        color: #333;
      }
    }

    .account-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .account-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        font-size: 0.85rem;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .value {
        font-size: 1.1rem;
        color: #333;
        font-weight: 500;

        &.balance {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e3c72;
        }

        &.active {
          color: #28a745;
        }

        &.inactive {
          color: #dc3545;
        }
      }
    }
  `]
})
export class AccountDetailsComponent implements OnInit {
  private accountService = inject(AccountService);

  account: AccountResponseDTO | null = null;
  isLoading = true;
  showError = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadAccount();
  }

  loadAccount(): void {
    this.accountService.getMyAccount().subscribe({
      next: (account) => {
        this.account = account;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showError = true;
        this.errorMessage = 'Impossible de charger les détails du compte';
        console.error(error);
      }
    });
  }
}
