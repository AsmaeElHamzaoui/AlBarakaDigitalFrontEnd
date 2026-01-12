import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert" 
         [class.alert-success]="type === 'success'"
         [class.alert-error]="type === 'error'"
         [class.alert-warning]="type === 'warning'"
         [class.alert-info]="type === 'info'"
         *ngIf="visible">
      <div class="alert-content">
        <span class="alert-icon">{{ getIcon() }}</span>
        <div class="alert-text">
          <strong *ngIf="title">{{ title }}</strong>
          <p>{{ message }}</p>
        </div>
      </div>
      <button class="alert-close" (click)="close()" *ngIf="dismissible">
        ✕
      </button>
    </div>
  `,
  styles: [`
    .alert {
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .alert-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .alert-icon {
      font-size: 1.5rem;
    }

    .alert-text {
      flex: 1;
      
      strong {
        display: block;
        margin-bottom: 0.25rem;
      }
      
      p {
        margin: 0;
        font-size: 0.9rem;
      }
    }

    .alert-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .alert-warning {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeaa7;
    }

    .alert-info {
      background: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }

    .alert-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.3s;
      
      &:hover {
        opacity: 1;
      }
    }
  `]
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() title = '';
  @Input() message = '';
  @Input() dismissible = true;
  @Input() visible = true;
  @Output() closed = new EventEmitter<void>();

  getIcon(): string {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[this.type];
  }

  close(): void {
    this.visible = false;
    this.closed.emit();
  }
}