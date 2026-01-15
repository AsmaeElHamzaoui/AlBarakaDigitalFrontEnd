import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  template: `
    <div class="document-upload">
      <div class="upload-area" 
           [class.dragover]="isDragOver"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)"
           (click)="fileInput.click()">
        <div class="upload-icon">📄</div>
        <p class="upload-text">
          <strong>Cliquez pour sélectionner</strong> ou glissez-déposez un fichier
        </p>
        <p class="upload-info">PDF, JPG, PNG (max 5 Mo)</p>
        <input 
          #fileInput
          type="file" 
          (change)="onFileSelected($event)"
          accept=".pdf,.jpg,.jpeg,.png"
          style="display: none;"
        />
      </div>

      <div *ngIf="selectedFile" class="file-preview">
        <div class="file-info">
          <span class="file-icon">📎</span>
          <div class="file-details">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
          </div>
          <button class="btn-remove" (click)="removeFile()">✕</button>
        </div>
      </div>

      <app-alert 
        *ngIf="errorMessage"
        type="error"
        [message]="errorMessage"
        [dismissible]="true"
        (closed)="errorMessage = ''">
      </app-alert>
    </div>
  `,
  styles: [`
    .document-upload {
      margin: 1.5rem 0;
    }

    .upload-area {
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f8f9fa;

      &:hover, &.dragover {
        border-color: #1e3c72;
        background: #e7f1ff;
      }

      .upload-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .upload-text {
        margin: 0 0 0.5rem;
        color: #333;

        strong {
          color: #1e3c72;
        }
      }

      .upload-info {
        margin: 0;
        font-size: 0.85rem;
        color: #666;
      }
    }

    .file-preview {
      margin-top: 1rem;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 8px;

      .file-icon {
        font-size: 2rem;
      }

      .file-details {
        flex: 1;
        display: flex;
        flex-direction: column;

        .file-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .file-size {
          font-size: 0.85rem;
          color: #666;
        }
      }

      .btn-remove {
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s;

        &:hover {
          background: #c82333;
        }
      }
    }
  `]
})
export class DocumentUploadComponent {
  @Input() maxSize = 5 * 1024 * 1024; // 5 Mo par défaut
  @Input() allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileRemoved = new EventEmitter<void>();

  selectedFile: File | null = null;
  isDragOver = false;
  errorMessage = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  handleFile(file: File): void {
    this.errorMessage = '';

    // Validation du type
    if (!this.allowedTypes.includes(file.type)) {
      this.errorMessage = 'Type de fichier non autorisé. Utilisez PDF, JPG ou PNG.';
      return;
    }

    // Validation de la taille
    if (file.size > this.maxSize) {
      this.errorMessage = `Fichier trop volumineux. Taille maximale: ${this.formatFileSize(this.maxSize)}.`;
      return;
    }

    this.selectedFile = file;
    this.fileSelected.emit(file);
  }

  removeFile(): void {
    this.selectedFile = null;
    this.errorMessage = '';
    this.fileRemoved.emit();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
