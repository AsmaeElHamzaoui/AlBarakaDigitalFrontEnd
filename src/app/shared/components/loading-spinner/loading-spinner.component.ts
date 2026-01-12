import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container" *ngIf="isLoading">
      <div class="spinner" [class.small]="size === 'small'" [class.large]="size === 'large'">
        <div class="spinner-border"></div>
      </div>
      <p class="spinner-message" *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .spinner {
      display: inline-block;
    }

    .spinner-border {
      width: 3rem;
      height: 3rem;
      border: 0.25rem solid rgba(30, 60, 114, 0.2);
      border-top-color: #1e3c72;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }

    .spinner.small .spinner-border {
      width: 1.5rem;
      height: 1.5rem;
      border-width: 0.2rem;
    }

    .spinner.large .spinner-border {
      width: 4rem;
      height: 4rem;
      border-width: 0.3rem;
    }

    .spinner-message {
      margin-top: 1rem;
      color: #6c757d;
      font-size: 0.9rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() isLoading = true;
  @Input() message = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}