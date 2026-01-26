import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AccountRequestDTO } from '../../models/account.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    AlertComponent
  ],
  template: ``,
  styles: ``
    
})
export class AccountCreateComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);

  accountForm: FormGroup;
  isSubmitting = false;
  showError = false;
  showSuccess = false;
  errorMessage = '';

  constructor() {
    this.accountForm = this.fb.group({
      numeroCompte: ['', [Validators.required, Validators.minLength(8)]],
      balance: [0, [Validators.required, Validators.min(0)]]
    });
  }

  get numeroCompte() {
    return this.accountForm.get('numeroCompte');
  }


  get soldeInitial() {
    return this.accountForm.get('soldeInitial');
  }

 // Dans AccountCreateComponent (onSubmit)
onSubmit(): void {
  if (this.accountForm.invalid) {
    this.accountForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;

  const formValue = this.accountForm.value;

  const accountRequest = {
    accountNumber: formValue.numeroCompte,
    balance: formValue.soldeInitial     // ← important : balance et non initialBalance
  };

  this.accountService.createAccount(accountRequest).subscribe({
    next: (response) => {
      this.isSubmitting = false;
      this.showSuccess = true;
      setTimeout(() => {
        this.router.navigate(['/client/account']);
      }, 1800);
    },
    error: (error) => {
      this.isSubmitting = false;
      this.showError = true;
      this.errorMessage = error.error?.message 
        || 'Erreur lors de la création du compte';
      console.error(error);
    }
  });
}
  onCancel(): void {
    this.router.navigate(['/client/dashboard']);
  }
}