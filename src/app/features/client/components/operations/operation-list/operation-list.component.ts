import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OperationService } from '../../../services/operation.service';
import { OperationResponseDTO } from '../../../models/operation.model';
import { OperationStatus } from '../../../models/operation-type.enum';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyFormatPipe } from '../../../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../../../shared/pipes/date-format.pipe';

@Component({
    selector: 'app-operation-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        LoadingSpinnerComponent,
        CurrencyFormatPipe,
        DateFormatPipe
    ],
    template: `
    <div class="operation-list-container">
      <div class="header">
        <h1>Mes opérations</h1>
        <div class="action-buttons">
          <a routerLink="/client/operations/deposit" class="btn btn-deposit">💰 Dépôt</a>
          <a routerLink="/client/operations/withdrawal" class="btn btn-withdrawal">💸 Retrait</a>
          <a routerLink="/client/operations/transfer" class="btn btn-transfer">🔄 Virement</a>
        </div>
      </div>

      <app-loading-spinner 
        *ngIf="isLoading" 
        [isLoading]="true"
        message="Chargement des opérations...">
      </app-loading-spinner>

      <div *ngIf="!isLoading" class="operations-table">
        <div *ngIf="operations.length === 0" class="no-operations">
          <p>Aucune opération trouvée</p>
          <a routerLink="/client/dashboard" class="btn btn-primary">Retour au tableau de bord</a>
        </div>

        <table *ngIf="operations.length > 0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Montant</th>
              <th>Description</th>
              <th>Statut</th>
              <th>Justificatif</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let operation of operations">
              <td>{{ operation.dateOperation | dateFormat:'datetime' }}</td>
              <td>
                <span class="badge" [ngClass]="'badge-' + operation.type.toLowerCase()">
                  {{ operation.type }}
                </span>
              </td>
              <td class="amount">{{ operation.montant | currencyFormat }}</td>
              <td>{{ operation.description || '-' }}</td>
              <td>
                <span class="status" [ngClass]="getStatusClass(operation.statut)">
                  {{ getStatusLabel(operation.statut) }}
                </span>
              </td>
              <td>
                <span *ngIf="operation.justificatifPath" class="has-doc">📄 Oui</span>
                 <td>
                <span *ngIf="operation.justificatifPath" class="has-doc">📄 Oui</span>
                <span *ngIf="!operation.justificatifPath" class="no-doc">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
    styles: [`
    .operation-list-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        margin: 0;
        color: #333;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;

          &.btn-deposit {
            background: #28a745;
            color: white;
            &:hover { background: #218838; }
          }

          &.btn-withdrawal {
            background: #ffc107;
            color: #333;
            &:hover { background: #e0a800; }
          }

          &.btn-transfer {
            background: #17a2b8;
            color: white;
            &:hover { background: #138496; }
          }
        }
      }
    }

    .operations-table {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

      .no-operations {
        text-align: center;
        padding: 3rem;

        p {
          color: #999;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
      }

      table {
        width: 100%;
        border-collapse: collapse;

        thead {
          background: #f8f9fa;

          th {
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: #495057;
            border-bottom: 2px solid #dee2e6;
          }
        }

        tbody {
          tr {
            border-bottom: 1px solid #e0e0e0;
            transition: background 0.2s;

            &:hover {
              background: #f8f9fa;
            }

            td {
              padding: 1rem;

              &.amount {
                font-weight: 600;
                color: #1e3c72;
              }

              .badge {
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.85rem;
                font-weight: 500;

                &.badge-depot {
                  background: #d4edda;
                  color: #155724;
                }

                &.badge-retrait {
                  background: #fff3cd;
                  color: #856404;
                }

                &.badge-virement {
                  background: #d1ecf1;
                  color: #0c5460;
                }
              }

              .status {
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.85rem;
                font-weight: 500;

                &.status-approved {
                  background: #d4edda;
                  color: #155724;
                }

                &.status-pending {
                  background: #fff3cd;
                  color: #856404;
                }

                &.status-rejected {
                  background: #f8d7da;
                  color: #721c24;
                }
              }

              .has-doc {
                color: #28a745;
              }

              .no-doc {
                color: #999;
              }
            }
          }
        }
      }
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;

        .action-buttons {
          width: 100%;
          flex-direction: column;
        }
      }

      table {
        display: block;
        overflow-x: auto;
      }
    }
  `]
})
export class OperationListComponent implements OnInit {
    private operationService = inject(OperationService);

    operations: OperationResponseDTO[] = [];
    isLoading = true;

    ngOnInit(): void {
        this.loadOperations();
    }

    loadOperations(): void {
        this.operationService.getMyOperations().subscribe({
            next: (operations) => {
                this.operations = operations.sort((a, b) =>
                    new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime()
                );
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Erreur lors du chargement des opérations', error);
            }
        });
    }

    getStatusClass(status: OperationStatus): string {
        switch (status) {
            case OperationStatus.APPROVED: return 'status-approved';
            case OperationStatus.PENDING: return 'status-pending';
            case OperationStatus.REJECTED: return 'status-rejected';
            default: return '';
        }
    }

    getStatusLabel(status: OperationStatus): string {
        switch (status) {
            case OperationStatus.APPROVED: return 'Approuvée';
            case OperationStatus.PENDING: return 'En attente';
            case OperationStatus.REJECTED: return 'Rejetée';
            default: return status;
        }
    }
}