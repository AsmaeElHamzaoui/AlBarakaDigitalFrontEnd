import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentOperationService } from '../../services/agent-operation.service';
import { OperationResponseDTO } from '../../../client/models/operation.model';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-pending-operations-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyFormatPipe,
    DateFormatPipe,
    LoadingSpinnerComponent
  ],
  templateUrl: './pending-operations-list.component.html',
  styleUrls: ['./pending-operations-list.component.scss']
})
export class PendingOperationsListComponent implements OnInit {

  private agentService = inject(AgentOperationService);

  operations: OperationResponseDTO[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadPendingOperations();
  }

  loadPendingOperations(): void {
    this.agentService.getPendingOperations().subscribe({
      next: ops => {
        this.operations = ops;
        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur chargement opérations en attente', err);
        this.isLoading = false;
      }
    });
  }

  approve(id: number): void {
    this.agentService.approveOperation(id).subscribe(() => {
      this.loadPendingOperations();
    });
  }

  reject(id: number): void {
    this.agentService.rejectOperation(id).subscribe(() => {
      this.loadPendingOperations();
    });
  }

  downloadDocument(id: number): void {
    this.agentService.downloadDocument(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
}
