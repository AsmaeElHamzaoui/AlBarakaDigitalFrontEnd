import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { Role } from '../../../../core/models/role.enum';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    AlertComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showError = false;
  showSuccess = false;
  successMessage = '';

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, CustomValidators.email()]],
      password: ['', [Validators.required, CustomValidators.strongPassword()]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.showError = false;
    this.showSuccess = false;

    const userRequest = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      fullName: this.registerForm.value.fullName,
      role: Role.CLIENT // Par défaut, les nouveaux utilisateurs sont des clients
    };

    this.authService.register(userRequest).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccess = true;
        this.successMessage = 'Inscription réussie ! Vous allez être redirigé vers la page de connexion...';
        
        // Rediriger vers login après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.showError = true;
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 409) {
      return 'Cet email est déjà utilisé';
    }
    if (error.status === 400) {
      return error.error?.message || 'Données invalides. Veuillez vérifier vos informations.';
    }
    return 'Une erreur est survenue. Veuillez réessayer.';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (field?.hasError('email')) {
      return 'Email invalide';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} caractères requis`;
    }
    if (field?.hasError('strongPassword')) {
      const errors = field.errors?.['strongPassword'];
      if (errors.minLength) return 'Le mot de passe doit contenir au moins 8 caractères';
      if (errors.uppercase) return 'Le mot de passe doit contenir au moins une majuscule';
      if (errors.lowercase) return 'Le mot de passe doit contenir au moins une minuscule';
      if (errors.digit) return 'Le mot de passe doit contenir au moins un chiffre';
      if (errors.specialChar) return 'Le mot de passe doit contenir au moins un caractère spécial';
    }
    
    return '';
  }

  get passwordMismatch(): boolean {
    return !!(
      this.registerForm.hasError('passwordMismatch') &&
      this.registerForm.get('confirmPassword')?.touched
    );
  }
}