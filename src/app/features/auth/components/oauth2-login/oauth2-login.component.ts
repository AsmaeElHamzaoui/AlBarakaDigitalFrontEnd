import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { CustomValidators } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-oauth2-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    AlertComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="oauth2-login-container">
      <div class="oauth2-login-card">
        <!-- Header -->
        <div class="oauth2-login-header">
          <div class="logo">
            <span class="logo-text">Al Baraka</span>
            <span class="logo-digital">Digital</span>
          </div>
          <h2>Connexion OAuth2</h2>
          <p class="subtitle">Authentification via Keycloak</p>
        </div>

        <!-- Alert d'erreur -->
        <app-alert 
          *ngIf="showError"
          type="error"
          [message]="errorMessage"
          [dismissible]="true"
          (closed)="showError = false">
        </app-alert>

        <!-- Info OAuth2 -->
        <div class="oauth2-info">
          <p>Cette méthode de connexion utilise OAuth2/Keycloak pour l'authentification sécurisée.</p>
          <p><strong>Note:</strong> Cette connexion est requise pour accéder aux opérations en attente (endpoint /oauth2/pending).</p>
        </div>

        <!-- Formulaire OAuth2 -->
        <form [formGroup]="oauth2Form" (ngSubmit)="onSubmit()" class="oauth2-form">
          <!-- Email -->
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email"
              formControlName="email"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('email')"
              placeholder="exemple@albaraka.ma"
            />
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              {{ getFieldError('email') }}
            </div>
          </div>

          <!-- Mot de passe -->
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password"
              formControlName="password"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('password')"
              placeholder="••••••••"
            />
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              {{ getFieldError('password') }}
            </div>
          </div>

          <!-- Bouton de connexion -->
          <button 
            type="submit" 
            class="btn-oauth2-login"
            [disabled]="isLoading"
          >
            <app-loading-spinner 
              *ngIf="isLoading" 
              [isLoading]="true" 
              size="small">
            </app-loading-spinner>
            <span *ngIf="!isLoading">Se connecter avec OAuth2</span>
          </button>

          <!-- Lien retour -->
          <div class="form-footer">
            <a routerLink="/auth/login" class="link-back">← Retour à la connexion classique</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .oauth2-login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      padding: 2rem;
    }

    .oauth2-login-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 3rem;
      width: 100%;
      max-width: 450px;
      animation: slideUp 0.5s ease;
    }

    .oauth2-login-header {
      text-align: center;
      margin-bottom: 2rem;
      
      .logo {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        font-size: 1.8rem;
        font-weight: 700;
        
        .logo-text {
          color: #1e3c72;
        }
        
        .logo-digital {
          color: #11998e;
        }
      }
      
      h2 {
        margin: 1rem 0 0.5rem;
        color: #333;
        font-size: 1.75rem;
      }
      
      .subtitle {
        color: #666;
        font-size: 0.95rem;
      }
    }

    .oauth2-info {
      background: #e8f5e9;
      border-left: 4px solid #11998e;
      padding: 1rem;
      margin-bottom: 1.5rem;
      border-radius: 4px;
      
      p {
        margin: 0.5rem 0;
        font-size: 0.9rem;
        color: #333;
        line-height: 1.5;
      }
    }

    .oauth2-form {
      .form-group {
        margin-bottom: 1.5rem;
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #333;
          font-weight: 500;
          font-size: 0.95rem;
        }
        
        .form-control {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          
          &:focus {
            outline: none;
            border-color: #11998e;
            box-shadow: 0 0 0 3px rgba(17, 153, 142, 0.1);
          }
          
          &.is-invalid {
            border-color: #dc3545;
          }
        }
        
        .error-message {
          color: #dc3545;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }
      }
      
      .btn-oauth2-login {
        width: 100%;
        padding: 0.875rem;
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(17, 153, 142, 0.4);
        }
        
        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }
      
      .form-footer {
        margin-top: 1.5rem;
        text-align: center;
        
        .link-back {
          color: #11998e;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class OAuth2LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  oauth2Form!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showError = false;

  ngOnInit(): void {
    this.oauth2Form = this.fb.group({
      email: ['', [Validators.required, CustomValidators.email()]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.oauth2Form.invalid) {
      this.markFormGroupTouched(this.oauth2Form);
      return;
    }

    this.isLoading = true;
    this.showError = false;

    const credentials = this.oauth2Form.value;

    this.authService.loginOAuth2(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        // Rediriger vers le dashboard agent (car OAuth2 est principalement pour les agents)
        this.router.navigate(['/agent/pending-operations']);
      },
      error: (error) => {
        this.isLoading = false;
        this.showError = true;
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Authentification OAuth2 échouée. Vérifiez vos identifiants Keycloak.';
    }
    if (error.status === 403) {
      return 'Accès refusé. Vérifiez vos permissions Keycloak.';
    }
    return 'Erreur de connexion OAuth2. Vérifiez la configuration Keycloak.';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.oauth2Form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.oauth2Form.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (field?.hasError('email')) {
      return 'Email invalide';
    }
    if (field?.hasError('minlength')) {
      return 'Minimum 6 caractères requis';
    }
    
    return '';
  }
}