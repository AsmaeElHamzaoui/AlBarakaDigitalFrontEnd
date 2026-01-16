import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { OperationService } from '../../services/operation.service';
import { AccountResponseDTO } from '../../models/account.model';
import { OperationResponseDTO } from '../../models/operation.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { OperationStatus } from '../../models/operation-type.enum';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    LoadingSpinnerComponent, 
    AlertComponent,
    CurrencyFormatPipe,
    DateFormatPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private accountService = inject(AccountService);
  private operationService = inject(OperationService);

  account: AccountResponseDTO | null = null;
  recentOperations: OperationResponseDTO[] = [];
  isLoadingAccount = true;
  isLoadingOperations = true;
  errorMessage = '';
  showError = false;

  OperationStatus = OperationStatus;

  ngOnInit(): void {
    this.loadAccount();
    this.loadRecentOperations();
  }

  loadAccount(): void {
    this.accountService.getMyAccount().subscribe({
      next: (account) => {
        this.account = account;
        this.isLoadingAccount = false;
      },
      error: (error) => {
        this.isLoadingAccount = false;
        this.showError = true;
        this.errorMessage = 'Impossible de charger les informations du compte';
        console.error(error);
      }
    });
  }

  loadRecentOperations(): void {
    this.operationService.getMyOperations().subscribe({
      next: (operations) => {
        // Trier par date décroissante et prendre les 5 dernières
        this.recentOperations = operations
          .sort((a, b) => new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime())
          .slice(0, 5);
        this.isLoadingOperations = false;
      },
      error: (error) => {
        this.isLoadingOperations = false;
        console.error('Erreur lors du chargement des opérations', error);
      }
    });
  }

  getStatusClass(status: OperationStatus): string {
    switch (status) {
      case OperationStatus.APPROVED:
        return 'status-approved';
      case OperationStatus.PENDING:
        return 'status-pending';
      case OperationStatus.REJECTED:
        return 'status-rejected';
      default:
        return '';
    }
  }

  getStatusLabel(status: OperationStatus): string {
    switch (status) {
      case OperationStatus.APPROVED:
        return 'Approuvée';
      case OperationStatus.PENDING:
        return 'En attente';
      case OperationStatus.REJECTED:
        return 'Rejetée';
      default:
        return status;
    }
  }

  get pendingCount(): number {
  return this.recentOperations.filter(
    op => op.statut === OperationStatus.PENDING
  ).length;
}

get approvedCount(): number {
  return this.recentOperations.filter(
    op => op.statut === OperationStatus.APPROVED
  ).length;
}

}