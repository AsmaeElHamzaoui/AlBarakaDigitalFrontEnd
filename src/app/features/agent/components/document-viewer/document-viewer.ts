import { Component, Input, inject } from '@angular/core';
import { AgentOperationService } from '../../services/agent-operation.service';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  template: `
    <button (click)="download()">📥 Télécharger justificatif</button>
  `
})
export class DocumentViewerComponent {

  @Input() operationId!: number;
  private service = inject(AgentOperationService);

  download(): void {
    this.service.downloadDocument(this.operationId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'justificatif.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
