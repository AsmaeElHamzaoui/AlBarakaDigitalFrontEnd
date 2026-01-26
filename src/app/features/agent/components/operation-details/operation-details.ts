import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AgentOperationService } from '../../services/agent-operation.service';
import { OperationResponseDTO } from '../../../client/models/operation.model';
import { DocumentViewerComponent } from '../document-viewer/document-viewer'; 

@Component({
  selector: 'app-operation-details',
  standalone: true,
  imports: [
    CommonModule,            // ⭐ POUR *ngIf
    DocumentViewerComponent  // ⭐ POUR <app-document-viewer>
  ],
  template: `
    <div *ngIf="operation">
      <h2>Détails opération #{{ operation.id }}</h2>

      <p><strong>Type :</strong> {{ operation.type }}</p>
      <p><strong>Montant :</strong> {{ operation.amount }}</p>
      <p><strong>Status Operation :</strong> {{ operation.status || '-' }}</p>

      <button (click)="approve()">✅ Approuver</button>
      <button (click)="reject()">❌ Rejeter</button>

   
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
