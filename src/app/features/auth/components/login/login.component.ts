import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { CustomValidators } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    AlertComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showError = false;
  returnUrl = '';

  ngOnInit(): void {
    // Récupérer l'URL de retour
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';

    // Initialiser le formulaire
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, CustomValidators.email()]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.showError = false;

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        
        // Rediriger selon le rôle ou vers returnUrl
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.authService.redirectByRole();
        }
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
      return 'Email ou mot de passe incorrect';
    }
    if (error.status === 403) {
      return 'Votre compte est désactivé. Contactez un administrateur.';
    }
    return 'Une erreur est survenue. Veuillez réessayer.';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters pour les validations
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
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