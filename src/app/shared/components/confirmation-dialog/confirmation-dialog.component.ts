import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-backdrop" *ngIf="isOpen" (click)="onCancel()">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ title }}</h3>
          <button class="dialog-close" (click)="onCancel()">✕</button>
        </div>
        
        <div class="dialog-body">
          <p>{{ message }}</p>
        </div>
        
        <div class="dialog-footer">
          <button class="btn btn-secondary" (click)="onCancel()">
            {{ cancelText }}
          </button>
          <button class="btn btn-primary" 
                  [class.btn-danger]="type === 'danger'"
                  (click)="onConfirm()">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease;
    }

    .dialog-container {
      background: white;
      border-radius: 12px;
      min-width: 400px;
      max-width: 500px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
    }

    .dialog-header {
      padding: 1.5rem;
      border-bottom: 1px solid #dee2e6;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h3 {
        margin: 0;
        color: #333;
        font-size: 1.25rem;
      }
    }

    .dialog-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
      
      &:hover {
        color: #333;
      }
    }

    .dialog-body {
      padding: 1.5rem;
      color: #666;
      line-height: 1.6;
      
      p {
        margin: 0;
      }
    }

    .dialog-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #dee2e6;
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.5rem 1.5rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      
      &:hover {
        background: #5a6268;
      }
    }

    .btn-primary {
      background: #1e3c72;
      color: white;
      
      &:hover {
        background: #163059;
      }
    }

    .btn-danger {
      background: #dc3545;
      
      &:hover {
        background: #c82333;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `]
})
export class ConfirmationDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmation';
  @Input() message = 'Êtes-vous sûr de vouloir continuer ?';
  @Input() confirmText = 'Confirmer';
  @Input() cancelText = 'Annuler';
  @Input() type: 'primary' | 'danger' = 'primary';
  
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
    this.isOpen = false;
  }

  onCancel(): void {
    this.cancelled.emit();
    this.isOpen = false;
  }
}