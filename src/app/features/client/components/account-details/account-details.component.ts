import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AccountResponseDTO ,AccountRequestDTO } from '../../models/account.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LoadingSpinnerComponent,
    AlertComponent,
    CurrencyFormatPipe,
    DateFormatPipe
  ],
  templateUrl: './account-details.component.html',
})
export class AccountDetailsComponent implements OnInit {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  account: AccountResponseDTO | null = null;
  isLoading = true;
  hasNoAccount = false;
  errorMessage = '';
  showForm = false;

  accountForm = this.fb.group({
    accountNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    balance: [0, [Validators.required, Validators.min(0)]],
    currency: ['MAD', Validators.required]
  });

  ngOnInit(): void {
    this.loadAccount();
  }

  private loadAccount(): void {
    this.isLoading = true;

    this.accountService.getMyAccount().subscribe({
      next: (account) => {
        this.account = account;
        this.hasNoAccount = false;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.hasNoAccount = true;
          this.account = null;
        } else {
          this.errorMessage = 'Erreur lors du chargement du compte';
        }
        this.isLoading = false;
      }
    });
  }

  toggleCreateForm(): void {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.accountForm.reset({
        accountNumber: '',
        balance: 0,
        currency: 'MAD'
      });
    }
  }

  onSubmitCreateAccount(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    const request: AccountRequestDTO = this.accountForm.value as AccountRequestDTO;

    this.accountService.createAccount(request).subscribe({
      next: (createdAccount) => {
        this.account = createdAccount;
        this.hasNoAccount = false;
        this.showForm = false;
        alert('Compte créé avec succès !');
      },
      error: (err) => {
        if (err.status === 400 && err.error?.message?.includes('déjà')) {
          this.errorMessage = 'Vous possédez déjà un compte bancaire';
        } else {
          this.errorMessage = err.error?.message || 'Erreur lors de la création du compte';
        }
      }
    });
  }
}