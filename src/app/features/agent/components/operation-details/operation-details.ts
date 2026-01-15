import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentOperationService } from '../../services/agent-operation.service';
import { OperationResponseDTO } from '../../../client/models/operation.model';

@Component({
  selector: 'app-operation-details',
  standalone: true,
  template: `
    <div *ngIf="operation">
      <h2>Détails opération #{{ operation.id }}</h2>

      <p><strong>Type :</strong> {{ operation.type }}</p>
      <p><strong>Montant :</strong> {{ operation.montant }}</p>
      <p><strong>Description :</strong> {{ operation.description || '-' }}</p>

      <button (click)="approve()">✅ Approuver</button>
      <button (click)="reject()">❌ Rejeter</button>

      <app-document-viewer
        *ngIf="operation.justificatifPath"
        [operationId]="operation.id">
      </app-document-viewer>
    </div>
  `
})
export class OperationDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private service = inject(AgentOperationService);

  operation!: OperationResponseDTO;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getPendingOperations().subscribe(data => {
      this.operation = data.find(o => o.id === id)!;
    });
  }

  approve(): void {
    this.service.approveOperation(this.operation.id).subscribe();
  }

  reject(): void {
    this.service.rejectOperation(this.operation.id).subscribe();
  }
}
